import Link from 'next/link';

export const metadata = {
	title: 'Pagina non trovata | Depa Pastryshop',
	robots: { index: false },
};

export default function NotFound() {
	return (
		<main className="min-h-[100svh] flex flex-col items-center justify-center gap-6 px-6 text-center">
			<p className="text-xs tracking-[0.3em] uppercase text-depa-senape">Errore 404</p>
			<h1 className="text-4xl md:text-6xl font-light">
				Questa pagina <span className="text-depa-senape">non è in vetrina</span>
			</h1>
			<Link
				href="/"
				className="mt-4 rounded-full border border-depa-senape px-6 py-3 text-sm tracking-[0.1em] uppercase text-depa-senape hover:bg-depa-senape hover:text-depa-black transition-colors"
			>
				Torna alla home
			</Link>
		</main>
	);
}
