import localFont from 'next/font/local';

// Il sito usa solo il peso 300 (font-light): un unico file WOFF2 da 32 KB invece di tre OTF da 125 KB.
export const museo = localFont({
	src: [{ path: '../../public/fonts/Museo-300.woff2', weight: '300', style: 'normal' }],
	variable: '--font-museo',
	display: 'swap',
	fallback: ['Georgia', 'serif'],
});
