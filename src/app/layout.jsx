import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MotionProvider from '@/components/MotionProvider';
import { museo } from '@/lib/fonts';
import { getSettings } from '@/lib/settings';
import { lines } from '@/lib/utils';

const domain = 'https://depapastryshop.com';
const title = 'Depa Pastryshop | Pasticceria artigianale a Roccapiemonte (SA)';
const description =
	'Pasticceria a Roccapiemonte: sfogliatelle, babà, bignè al pistacchio, il vassoio della domenica e torte per matrimoni e cerimonie. Prenota su WhatsApp.';

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
		images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Bignè di Depa Pastryshop su tagliere di legno' }],
	},
	twitter: { card: 'summary_large_image', title, description, images: ['/og.jpg'] },
	alternates: { canonical: '/' },
};

export const viewport = {
	themeColor: '#121210',
};

export default async function RootLayout({ children }) {
	const settings = await getSettings();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Bakery',
		name: settings.nome,
		url: domain,
		image: `${domain}/og.jpg`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: settings.via,
			postalCode: '84086',
			addressLocality: settings.citta,
			addressRegion: settings.provincia,
			addressCountry: 'IT',
		},
		telephone: settings.telefono ? `+39 ${settings.telefono}` : undefined,
		// Orari verificati (bio Instagram, confermati da Mauro)
		openingHoursSpecification: [
			{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' },
			{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '08:00', closes: '14:00' },
		],
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
						<MotionProvider>
							<ScrollProgress />
							<Header />
							{children}
							<Footer />
						</MotionProvider>
					</SettingsProvider>
				</body>
			</html>
		</StoryblokProvider>
	);
}
