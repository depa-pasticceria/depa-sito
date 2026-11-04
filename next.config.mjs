const sicurezza = [
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	// The following environment variables can be safely exposed to the public bundle.
	// The Storyblok public access token is required for features like live preview.
	env: {
		STORYBLOK_DELIVERY_API_TOKEN: process.env.STORYBLOK_DELIVERY_API_TOKEN,
		STORYBLOK_API_BASE_URL: process.env.STORYBLOK_API_BASE_URL,
		STORYBLOK_REGION: process.env.STORYBLOK_REGION,
	},
	images: {
		remotePatterns: [{ protocol: 'https', hostname: 'a.storyblok.com' }],
		// Foto di prodotto: qualità alta e AVIF (più nitido a parità di peso), WebP come riserva.
		formats: ['image/avif', 'image/webp'],
		qualities: [75, 80, 90],
	},
	experimental: {
		// CSS (Tailwind, circa 8 KB) dentro la pagina: un passaggio in meno prima del primo disegno,
		// che su rete mobile lenta vale mezzo secondo.
		inlineCss: true,
	},
	async headers() {
		return [
			// Il sito pubblico non si può incorporare in altri siti...
			{
				source: '/((?!preview).*)',
				headers: [...sicurezza, { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" }],
			},
			// ...l'anteprima delle bozze sì, ma solo dall'editor di Storyblok.
			{
				source: '/preview/:path*',
				headers: [
					...sicurezza,
					{ key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://app.storyblok.com" },
					{ key: 'X-Robots-Tag', value: 'noindex, nofollow' },
				],
			},
		];
	},
	async redirects() {
		// Pagina del vecchio sito WordPress
		return [{ source: '/new-opening', destination: '/', permanent: true }];
	},
};

export default nextConfig;
