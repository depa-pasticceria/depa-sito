import { getStoryblokApi } from '@/lib/storyblok';

export const storyVersion =
	process.env.NODE_ENV === 'development' ? 'draft' : 'published';

// Used until the "impostazioni" story exists in Storyblok, so the site always renders.
export const defaultSettings = {
	nome: 'Depa Pastryshop',
	via: 'Via Calvanese, 104',
	citta: 'Roccapiemonte',
	provincia: 'SA',
	zone_servite:
		'Roccapiemonte\nNocera Superiore\nNocera Inferiore\nCastel San Giorgio\nMercato San Severino',
	whatsapp: '+39 346 515 7975',
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
