export const lines = (text = '') =>
	text.split('\n').filter((line) => line.trim() !== '');

// Versione della foto adatta allo schermo per l'ingrandimento: abbastanza pixel per il display
// (anche 3x), mai più dell'originale. Le dimensioni reali sono nell'URL Storyblok (/f/space/WxH/...).
export const lightboxSrc = (url) => {
	const dims = /\/f\/\d+\/(\d+)x(\d+)\//.exec(url);
	if (!dims || typeof window === 'undefined') return url;
	const originale = Number(dims[1]);
	const serve = Math.ceil(Math.max(window.innerWidth, window.innerHeight) * (window.devicePixelRatio || 1));
	if (serve >= originale) return url;
	return `${url}/m/${serve}x0/filters:quality(90)`;
};

// Storyblok returns protocol-relative asset URLs, which next/image rejects.
export const imageSrc = (asset, fallback) => {
	const src = asset?.filename;
	if (!src) return fallback;
	return src.startsWith('//') ? `https:${src}` : src;
};
