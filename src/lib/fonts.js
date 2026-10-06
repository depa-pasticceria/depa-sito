import localFont from 'next/font/local';

export const museo = localFont({
	src: [
		{ path: '../../public/fonts/Museo-100.otf', weight: '100', style: 'normal' },
		{ path: '../../public/fonts/Museo-300.otf', weight: '300', style: 'normal' },
		{ path: '../../public/fonts/Museo-700.otf', weight: '700', style: 'normal' },
	],
	variable: '--font-museo',
	display: 'swap',
});
