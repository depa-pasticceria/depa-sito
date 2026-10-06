// Crea blocchi, immagini e contenuti iniziali nello space Storyblok.
// Uso: STORYBLOK_PAT=<personal access token> STORYBLOK_SPACE_ID=<id> node scripts/storyblok-setup.mjs
// Si puo rieseguire senza creare duplicati: aggiorna cio che esiste gia.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const PAT = process.env.STORYBLOK_PAT;
const SPACE = process.env.STORYBLOK_SPACE_ID;
const EDITOR_URL = process.env.STORYBLOK_EDITOR_URL || 'https://localhost:3000/';
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE}`;

if (!PAT || !SPACE) {
	console.error('Servono STORYBLOK_PAT e STORYBLOK_SPACE_ID');
	process.exit(1);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, url, body) {
	await wait(400); // limite Management API: 3 richieste al secondo
	const res = await fetch(`${BASE}${url}`, {
		method,
		headers: { Authorization: PAT, 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text}`);
	return text ? JSON.parse(text) : {};
}

const text = (display_name, extra = {}) => ({ type: 'text', display_name, ...extra });
const textarea = (display_name, extra = {}) => ({ type: 'textarea', display_name, ...extra });
const asset = (display_name) => ({ type: 'asset', display_name, filetypes: ['images'] });
const bloks = (display_name, whitelist) => ({
	type: 'bloks',
	display_name,
	restrict_components: true,
	component_whitelist: whitelist,
});

const components = [
	{
		name: 'voce_menu',
		display_name: 'Voce di menu',
		schema: { etichetta: text('Testo'), link: text('Link (es. #prodotti)') },
	},
	{
		name: 'prodotto',
		display_name: 'Prodotto',
		schema: { nome: text('Nome'), descrizione: textarea('Descrizione') },
	},
	{
		name: 'paragrafo',
		display_name: 'Paragrafo',
		schema: { testo: textarea('Testo') },
	},
	{
		name: 'evento',
		display_name: 'Tipo di evento',
		schema: { nome: text('Nome'), descrizione: textarea('Descrizione') },
	},
	{
		name: 'hero',
		display_name: 'Hero (apertura)',
		schema: {
			sopratitolo: text('Sopratitolo'),
			titolo: textarea('Titolo (una riga per ogni a capo, l ultima e in giallo)'),
			sottotitolo: textarea('Sottotitolo'),
			bottone_principale: text('Bottone principale'),
			link_principale: text('Link bottone principale'),
			bottone_secondario: text('Bottone secondario'),
			link_secondario: text('Link bottone secondario'),
			immagine: asset('Immagine'),
		},
	},
	{
		name: 'prodotti',
		display_name: 'Sezione Prodotti',
		schema: {
			titolo: text('Titolo'),
			titolo_evidenza: text('Parte del titolo in giallo'),
			intro: textarea('Introduzione'),
			prodotti: bloks('Prodotti', ['prodotto']),
		},
	},
	{
		name: 'storia',
		display_name: 'Sezione Storia',
		schema: {
			etichetta: text('Etichetta'),
			paragrafi: bloks('Paragrafi', ['paragrafo']),
		},
	},
	{
		name: 'eventi',
		display_name: 'Sezione Eventi',
		schema: {
			titolo: textarea('Titolo (una riga per ogni a capo)'),
			titolo_secondaria: text('Ultima riga del titolo'),
			titolo_evidenza: text('Parola in giallo'),
			intro: textarea('Introduzione'),
			eventi: bloks('Tipi di evento', ['evento']),
			bottone: text('Testo bottone'),
			link: text('Link bottone'),
			immagine_1: asset('Immagine grande'),
			immagine_2: asset('Immagine piccola'),
		},
	},
	{
		name: 'prenota',
		display_name: 'Sezione Prenota',
		schema: {
			titolo: textarea('Titolo (una riga per ogni a capo)'),
			intro: textarea('Introduzione'),
			bottone: text('Testo bottone invio'),
		},
	},
	{
		name: 'page',
		display_name: 'Pagina',
		is_root: true,
		is_nestable: false,
		schema: {
			body: bloks('Sezioni', ['hero', 'prodotti', 'storia', 'eventi', 'prenota']),
		},
	},
	{
		name: 'impostazioni',
		display_name: 'Impostazioni del sito',
		is_root: true,
		is_nestable: false,
		schema: {
			nome: text('Nome attivita'),
			logo: asset('Logo (bianco, sfondo trasparente)'),
			via: text('Via e numero'),
			citta: text('Citta'),
			provincia: text('Provincia (sigla)'),
			zone_servite: textarea('Zone servite (una per riga)'),
			instagram: text('Link Instagram'),
			facebook: text('Link Facebook'),
			menu: bloks('Voci del menu', ['voce_menu']),
			cta_etichetta: text('Testo bottone menu'),
			cta_link: text('Link bottone menu'),
		},
	},
];

async function upsertComponents() {
	const { components: existing } = await api('GET', '/components');
	for (const c of components) {
		const found = existing.find((e) => e.name === c.name);
		const payload = { component: { is_root: false, is_nestable: true, ...c } };
		if (found) {
			await api('PUT', `/components/${found.id}`, payload);
			console.log('componente aggiornato:', c.name);
		} else {
			await api('POST', '/components', payload);
			console.log('componente creato:', c.name);
		}
	}
}

async function uploadAsset(file, alt) {
	const filename = path.basename(file);
	const found = await api('GET', `/assets?search=${encodeURIComponent(filename)}&per_page=5`);
	const same = found.assets?.find((a) => a.filename.endsWith(`/${filename}`));
	if (same) return { id: same.id, filename: same.filename, alt, fieldtype: 'asset' };

	const signed = await api('POST', '/assets', { filename });
	const form = new FormData();
	for (const [k, v] of Object.entries(signed.fields)) form.append(k, v);
	form.append('file', new Blob([await readFile(file)]), filename);
	const up = await fetch(signed.post_url, { method: 'POST', body: form });
	if (!up.ok) throw new Error(`upload ${filename} -> ${up.status} ${await up.text()}`);
	await api('GET', `/assets/${signed.id}/finish_upload`);
	await api('PUT', `/assets/${signed.id}`, { asset: { alt } });
	console.log('immagine caricata:', filename);
	return { id: signed.id, filename: signed.pretty_url, alt, fieldtype: 'asset' };
}

const uid = () => crypto.randomUUID();

async function upsertStory({ name, slug, content }) {
	const found = await api('GET', `/stories?with_slug=${slug}`);
	const existing = found.stories?.[0];
	if (existing) {
		await api('PUT', `/stories/${existing.id}`, { story: { name, slug, content }, publish: 1 });
		console.log('pagina aggiornata:', slug);
	} else {
		await api('POST', '/stories', { story: { name, slug, content }, publish: 1 });
		console.log('pagina creata:', slug);
	}
}

async function main() {
	await api('PUT', '', { space: { domain: EDITOR_URL } });
	console.log('indirizzo editor visivo:', EDITOR_URL);

	await upsertComponents();

	const img = (file) => path.join('public', 'images', file);
	const hero = await uploadAsset(
		img('hero/pasticciere.jpg'),
		'Il pasticciere Depa mentre decora una torta a mano, Roccapiemonte',
	);
	const torta1 = await uploadAsset(
		img('eventi/torta-cerimonia-1.jpeg'),
		'Torta da cerimonia con frutti di bosco, Depa Pastryshop',
	);
	const torta2 = await uploadAsset(
		img('eventi/torta-cerimonia-2.jpeg'),
		'Dettaglio torta multipiano per cerimonie, Depa Pastryshop',
	);
	const logo = await uploadAsset(
		img('logo/depa-mark-bianco-transparent.png'),
		'Depa Pastryshop',
	);

	const item = (component, fields) => ({ _uid: uid(), component, ...fields });

	await upsertStory({
		name: 'Impostazioni',
		slug: 'impostazioni',
		content: {
			component: 'impostazioni',
			nome: 'Depa Pastryshop',
			logo,
			via: 'Via Calvanese, 104',
			citta: 'Roccapiemonte',
			provincia: 'SA',
			zone_servite:
				'Roccapiemonte\nNocera Superiore\nNocera Inferiore\nCastel San Giorgio\nMercato San Severino',
			instagram: 'https://instagram.com/depapastryshop',
			facebook: 'https://facebook.com/depapastryshop',
			menu: [
				item('voce_menu', { etichetta: 'Prodotti', link: '#prodotti' }),
				item('voce_menu', { etichetta: 'Storia', link: '#storia' }),
				item('voce_menu', { etichetta: 'Eventi', link: '#eventi' }),
			],
			cta_etichetta: 'Prenota',
			cta_link: '#prenota',
		},
	});

	await upsertStory({
		name: 'Home',
		slug: 'home',
		content: {
			component: 'page',
			body: [
				item('hero', {
					sopratitolo: 'Pasticceria artigianale · Roccapiemonte',
					titolo: 'Ogni dolce\nracconta\nuna storia.',
					sottotitolo:
						'Materie prime scelte, lavorate con la cura di sempre, per farti sentire a casa a ogni morso.',
					bottone_principale: 'Prenota i tuoi dolci',
					link_principale: '#prenota',
					bottone_secondario: 'Dolci per eventi',
					link_secondario: '#eventi',
					immagine: hero,
				}),
				item('prodotti', {
					titolo: 'Cosa trovi',
					titolo_evidenza: 'in vetrina',
					intro: 'Ogni prodotto nasce in laboratorio e cambia con le stagioni.',
					prodotti: [
						item('prodotto', {
							nome: 'Torte artigianali',
							descrizione:
								'Farcite e decorate a mano ogni giorno, dalle classiche alla frutta fresca alle creazioni su richiesta.',
						}),
						item('prodotto', {
							nome: 'Pasticceria mignon',
							descrizione:
								'Piccoli assaggi per grandi occasioni: mousse, cheesecake, red velvet, gianduia, in formato monoporzione.',
						}),
						item('prodotto', {
							nome: 'Biscotteria da forno',
							descrizione:
								'Cantucci, cookies e tarallini al limone di Amalfi, prodotti artigianalmente con ricette originali.',
						}),
						item('prodotto', {
							nome: 'Dolci per cerimonie',
							descrizione:
								'Torte scenografiche e composizioni dedicate a matrimoni, battesimi e comunioni.',
						}),
					],
				}),
				item('storia', {
					etichetta: 'La nostra storia',
					paragrafi: [
						item('paragrafo', {
							testo:
								'Depa nasce dalla passione per la pasticceria fatta come si deve: materie prime scelte, lavorazione artigianale, ogni giorno.',
						}),
						item('paragrafo', {
							testo:
								'Ogni giorno il laboratorio di Roccapiemonte lavora per la vetrina: quello che vedi esposto è uscito dal forno poche ore prima.',
						}),
						item('paragrafo', {
							testo:
								'Con il tempo Depa è diventato un punto di riferimento anche per chi arriva da Nocera Superiore, Nocera Inferiore, Castel San Giorgio e Mercato San Severino: la stessa cura, dolce dopo dolce.',
						}),
					],
				}),
				item('eventi', {
					titolo: 'Un angolo dolce',
					titolo_secondaria: 'per il tuo',
					titolo_evidenza: 'evento',
					intro:
						"Matrimoni, battesimi, comunioni: raccontaci l'occasione, pensiamo noi alla parte dolce. Composizioni su misura, pensate per il numero di invitati e il tema della giornata.",
					eventi: [
						item('evento', {
							nome: 'Matrimoni',
							descrizione:
								'Un angolo dolce su misura per il giorno più importante: torte scenografiche e piccola pasticceria per gli invitati.',
						}),
						item('evento', {
							nome: 'Battesimi',
							descrizione:
								'Composizioni delicate e personalizzabili, pensate per accompagnare una giornata di festa in famiglia.',
						}),
						item('evento', {
							nome: 'Comunioni',
							descrizione:
								'Dolci curati nei dettagli, da abbinare al tema della cerimonia e da condividere con parenti e amici.',
						}),
					],
					bottone: 'Richiedi informazioni per il tuo evento',
					link: '#prenota',
					immagine_1: torta1,
					immagine_2: torta2,
				}),
				item('prenota', {
					titolo: 'Vieni a\ntrovarci.',
					intro:
						'Prenota i tuoi dolci per il ritiro in negozio oppure raccontaci il tuo evento: ti rispondiamo noi con disponibilità e proposte.',
					bottone: 'Invia richiesta',
				}),
			],
		},
	});

	console.log('Fatto.');
}

main().catch((e) => {
	console.error(e.message);
	process.exit(1);
});
