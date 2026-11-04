import { getStoryblokApi } from '@/lib/storyblok';

// STORYBLOK_VERSION=draft permette di provare in locale una build di produzione con le bozze.
export const storyVersion =
	process.env.STORYBLOK_VERSION || (process.env.NODE_ENV === 'development' ? 'draft' : 'published');

// Used until the "impostazioni" story exists in Storyblok, so the site always renders.
export const defaultSettings = {
	nome: 'Depa Pastryshop',
	via: 'Via Calvanese, 104',
	citta: 'Roccapiemonte',
	provincia: 'SA',
	zone_servite:
		'Roccapiemonte\nNocera Superiore\nNocera Inferiore\nCastel San Giorgio\nMercato San Severino',
	whatsapp: '+39 346 515 7975',
	telefono: '081 2596684',
	orari: 'Martedì-sabato 8-20\nDomenica 8-14\nLunedì chiuso',
	instagram: 'https://instagram.com/depapastryshop',
	facebook: 'https://facebook.com/depapastryshop',
	menu: [
		{ _uid: 'prodotti', etichetta: 'Prodotti', link: '#prodotti' },
		{ _uid: 'storia', etichetta: 'Storia', link: '#storia' },
		{ _uid: 'eventi', etichetta: 'Eventi', link: '#eventi' },
	],
	cta_etichetta: 'Prenota',
	cta_link: '#prenota',
};

export async function getSettings() {
	try {
		const { data } = await getStoryblokApi().get('cdn/stories/impostazioni', {
			version: storyVersion,
		});
		return { ...defaultSettings, ...data.story.content };
	} catch {
		return defaultSettings;
	}
}
