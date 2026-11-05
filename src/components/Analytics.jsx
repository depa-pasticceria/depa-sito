'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { CHIAVE_CONSENSO, GA_ID } from '@/lib/analytics';

// La scelta del visitatore vive in localStorage; useSyncExternalStore la legge senza errori di
// idratazione (sul server vale sempre "attesa", quindi il banner non compare nell'HTML statico).
const ascoltatori = new Set();
const iscrivi = (callback) => {
	ascoltatori.add(callback);
	return () => ascoltatori.delete(callback);
};
const leggi = () => {
	try {
		return window.localStorage.getItem(CHIAVE_CONSENSO) || 'nessuna';
	} catch {
		return 'nessuna';
	}
};
const lato_server = () => 'attesa';

function salva(valore) {
	try {
		window.localStorage.setItem(CHIAVE_CONSENSO, valore);
	} catch {
		/* navigazione privata: la scelta vale solo per questa visita */
	}
	ascoltatori.forEach((callback) => callback());
}

// Google Analytics 4 con Consent Mode v2: finché il visitatore non accetta, nessun cookie viene
// salvato. Lo script di Google (177 KB) si carica solo quando la pagina è già in uso: al primo
// scorrimento oppure dopo 5 secondi. Misurato: caricarlo subito rallentava il primo tocco di circa
// 1 secondo su telefoni lenti. Non parte in sviluppo, né nell'anteprima dell'editor di Storyblok.
export default function Analytics() {
	const percorso = usePathname();
	const scelta = useSyncExternalStore(iscrivi, leggi, lato_server);
	const [pronto, setPronto] = useState(false);

	useEffect(() => {
		let fatto = false;
		const avvia = () => {
			if (fatto) return;
			fatto = true;
			window.removeEventListener('scroll', alloScroll);
			clearTimeout(timer);
			// anche dopo lo scorrimento si aspetta un momento di pausa del browser
			if ('requestIdleCallback' in window) window.requestIdleCallback(() => setPronto(true), { timeout: 2000 });
			else setTimeout(() => setPronto(true), 1000);
		};
		const alloScroll = () => avvia();
		window.addEventListener('scroll', alloScroll, { passive: true, once: true });
		const timer = setTimeout(avvia, 5000);
		return () => {
			fatto = true;
			window.removeEventListener('scroll', alloScroll);
			clearTimeout(timer);
		};
	}, []);

	const attivo = process.env.NODE_ENV === 'production' && !percorso.startsWith('/preview');
	if (!attivo) return null;

	const decidi = (valore) => {
		salva(valore);
		if (typeof window.gtag === 'function') {
			window.gtag('consent', 'update', { analytics_storage: valore });
		}
	};

	return (
		<>
			{pronto && (
				<>
			<Script id="ga4-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					window.gtag = gtag;
					gtag('consent', 'default', {
						analytics_storage: 'denied',
						ad_storage: 'denied',
						ad_user_data: 'denied',
						ad_personalization: 'denied',
						wait_for_update: 500
					});
					try {
						if (window.localStorage.getItem('${CHIAVE_CONSENSO}') === 'granted') {
							gtag('consent', 'update', { analytics_storage: 'granted' });
						}
					} catch (e) {}
					gtag('js', new Date());
					gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });
				`}
			</Script>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
				</>
			)}

			{scelta === 'nessuna' && (
				<div
					data-cookie-banner
					role="dialog"
					aria-label="Preferenze sui cookie"
					className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-xl rounded-sm border border-depa-panna/15 bg-depa-graphite p-5 shadow-2xl shadow-black/60 md:inset-x-auto md:right-6 md:bottom-6 md:mx-0"
				>
					<p className="text-sm font-light leading-relaxed text-depa-panna/80">
						Questo sito utilizza cookie analitici per raccogliere statistiche anonime sulle visite. Vengono attivati solo con il tuo consenso.
					</p>
					<div className="mt-4 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => decidi('granted')}
							className="rounded-full bg-depa-senape px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-depa-black transition-colors hover:bg-depa-oro"
						>
							Accetta
						</button>
						<button
							type="button"
							onClick={() => decidi('denied')}
							className="rounded-full border border-depa-panna/30 px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-depa-panna transition-colors hover:border-depa-panna"
						>
							Rifiuta
						</button>
					</div>
				</div>
			)}
		</>
	);
}
