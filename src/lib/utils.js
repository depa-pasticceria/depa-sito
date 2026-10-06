export const lines = (text = '') =>
	text.split('\n').filter((line) => line.trim() !== '');

// Storyblok returns protocol-relative asset URLs, which next/image rejects.
export const imageSrc = (asset, fallback) => {
	const src = asset?.filename;
	if (!src) return fallback;
	return src.startsWith('//') ? `https:${src}` : src;
};
