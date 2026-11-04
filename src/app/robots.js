export default function robots() {
	return {
		rules: { userAgent: '*', allow: '/', disallow: '/preview/' },
		sitemap: 'https://depapastryshop.com/sitemap.xml',
	};
}
