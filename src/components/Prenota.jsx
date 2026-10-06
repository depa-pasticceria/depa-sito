'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal, FadeIn } from './Reveal';
import { useSettings } from '@/components/SettingsProvider';
import { lines } from '@/lib/utils';

export default function Prenota({ blok }) {
	const settings = useSettings();
	const [motivo, setMotivo] = useState('prenotazione');

	const inviaSuWhatsApp = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const apertura =
			motivo === 'prenotazione'
				? 'Ciao! Vorrei prenotare dei dolci.'
				: 'Ciao! Vorrei informazioni per un evento.';
		const testo = [
			apertura,
			`Mi chiamo ${data.get('nome')}.`,
			data.get('messaggio'),
		].join('\n');
		const numero = String(settings.whatsapp || '').replace(/\D/g, '');
		window.open(
			`https://wa.me/${numero}?text=${encodeURIComponent(testo)}`,
			'_blank',
			'noopener',
		);
	};

	return (
		<section
			{...storyblokEditable(blok)}
			id="prenota"
			className="relative bg-depa-panna text-depa-black px-6 md:px-10 py-28 md:py-36 scroll-mt-20"
		>
			<div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16">
				<div>
					<Reveal>
						<h2 className="text-4xl md:text-6xl font-light mb-6">
							{lines(blok.titolo).map((line) => (
								<span key={line} className="block">
									{line}
								</span>
							))}
						</h2>
					</Reveal>
					<FadeIn delay={0.1}>
						<p className="text-depa-black/60 font-light leading-relaxed max-w-sm mb-10">
							{blok.intro}
						</p>
					</FadeIn>

					<FadeIn delay={0.2} className="space-y-4 text-sm tracking-wide">
						<div>
							<p className="uppercase text-depa-black/40 mb-1">Indirizzo</p>
							<p className="font-light">
								{settings.via}, {settings.citta} ({settings.provincia})
							</p>
						</div>
						<div>
							<p className="uppercase text-depa-black/40 mb-1">Seguici</p>
							<div className="flex gap-4">
								{settings.instagram && (
									<a
										href={settings.instagram}
										target="_blank"
										rel="noreferrer"
										className="underline underline-offset-4 decoration-depa-senape hover:text-depa-senape"
									>
										Instagram
									</a>
								)}
								{settings.facebook && (
									<a
										href={settings.facebook}
										target="_blank"
										rel="noreferrer"
										className="underline underline-offset-4 decoration-depa-senape hover:text-depa-senape"
									>
										Facebook
									</a>
								)}
							</div>
						</div>
					</FadeIn>
				</div>

				<FadeIn delay={0.15}>
					<form
						onSubmit={inviaSuWhatsApp}
						className="flex flex-col gap-5 bg-depa-black text-depa-panna p-8 md:p-10 rounded-sm"
					>
						<div className="flex gap-2 mb-2">
							{['prenotazione', 'evento'].map((tipo) => (
								<button
									type="button"
									key={tipo}
									onClick={() => setMotivo(tipo)}
									className={`relative flex-1 rounded-full py-2.5 text-xs tracking-[0.15em] uppercase transition-colors ${
										motivo === tipo
											? 'text-depa-black'
											: 'text-depa-panna/60 hover:text-depa-panna'
									}`}
								>
									{motivo === tipo && (
										<motion.span
											layoutId="motivo-pill"
											className="absolute inset-0 rounded-full bg-depa-senape"
											transition={{ type: 'spring', stiffness: 350, damping: 30 }}
										/>
									)}
									<span className="relative">
										{tipo === 'prenotazione' ? 'Prenotazione' : 'Evento privato'}
									</span>
								</button>
							))}
						</div>

						<label className="flex flex-col gap-1.5 text-xs uppercase tracking-wide text-depa-panna/50">
							Nome
							<input
								type="text"
								name="nome"
								required
								className="rounded-none border-b border-depa-panna/20 bg-transparent py-2 text-base text-depa-panna outline-none focus:border-depa-senape"
							/>
						</label>

						<label className="flex flex-col gap-1.5 text-xs uppercase tracking-wide text-depa-panna/50">
							{motivo === 'prenotazione'
								? 'Cosa vuoi prenotare'
								: 'Raccontaci il tuo evento'}
							<textarea
								name="messaggio"
								rows={3}
								required
								className="resize-none rounded-none border-b border-depa-panna/20 bg-transparent py-2 text-base text-depa-panna outline-none focus:border-depa-senape"
							/>
						</label>

						<button
							type="submit"
							className="mt-2 rounded-full bg-depa-senape px-7 py-3.5 text-sm tracking-[0.1em] uppercase text-depa-black hover:bg-depa-oro transition-colors"
						>
							{blok.bottone || 'Invia richiesta'}
						</button>

						<p className="text-xs text-depa-panna/40">
							Si apre WhatsApp con il messaggio già pronto: ti basta premere Invia.
						</p>
					</form>
				</FadeIn>
			</div>
		</section>
	);
}
