// Google Analytics 4 (ID di misurazione pubblico, non è un segreto).
export const GA_ID = 'G-9LKHKDYL26';

export const CHIAVE_CONSENSO = 'depa-consenso-analytics';

// Invia un evento a GA4 solo se è presente (e solo se il visitatore ha dato il consenso: ci pensa Consent Mode).
export function evento(nome, parametri = {}) {
	if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
		window.gtag('event', nome, parametri);
	}
}

// Contatto verso il negozio via WhatsApp: è la conversione principale del sito.
export const contattoWhatsApp = (sorgente) =>
	evento('generate_lead', { method: 'whatsapp', lead_source: sorgente });
