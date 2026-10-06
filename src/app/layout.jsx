import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { museo } from '@/lib/fonts';
import { getSettings } from '@/lib/settings';
import { lines } from '@/lib/utils';

const domain = 'https://depapastryshop.com';
const title = 'Depa Pastryshop | Pasticceria artigianale a Roccapiemonte (SA)';
const description =
	'Pasticceria artigianale a Roccapiemonte: torte, pasticceria mignon e dolci per cerimonie. Al servizio di Nocera Superiore, Nocera Inferiore, Castel San Giorgio e Mercato San Severino.';

export const metadata = {
	metadataBase: new URL(domain),
	title,
	description,
	openGraph: {
		title,
		description,
		url: domain,
		siteName: 'Depa Pastryshop',
		locale: 'it_IT',
		type: 'website',
	},
	alternates: { canonical: '/' },
};

export default async function RootLayout({ children }) {
	const settings = await getSettings();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Bakery',
		name: settings.nome,
		address: {
			'@type': 'PostalAddress',
			streetAddress: settings.via,
			addressLocality: settings.citta,
			addressRegion: settings.provincia,
			addressCountry: 'IT',
		},
		areaServed: lines(settings.zone_servite).map((name) => ({
			'@type': 'City',
			name,
		})),
		sameAs: [settings.instagram, settings.facebook].filter(Boolean),
	};

	return (
		<StoryblokProvider>
			<html lang="it" className={museo.variable}>
				<body className="grain bg-depa-black text-depa-panna antialiased">
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
					/>
					<SettingsProvider value={settings}>
						<ScrollProgress />
						<Header />
						{children}
						<Footer />
					</SettingsProvider>
				</body>
			</html>
		</StoryblokProvider>
	);
}
