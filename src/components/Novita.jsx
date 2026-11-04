'use client';

import { m } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal, FadeIn } from './Reveal';
import { useSettings } from '@/components/SettingsProvider';
import { contattoWhatsApp } from '@/lib/analytics';

// Fascia "novità" nei colori del sito. Il richiamo alla box del panettone è solo il piccolo
// tassello con il suo rosso e il suo pattern: niente sezioni a tutto colore.
const ROSSO_BOX = '#921a22';

export default function Novita({ blok }) {
	const settings = useSettings();
	const numero = String(settings.whatsapp || '').replace(/\D/g, '');
	const link = `https://wa.me/${numero}?text=${encodeURIComponent(blok.messaggio_whatsapp || '')}`;

	return (
		<section
			{...storyblokEditable(blok)}
			id="novita"
			className="relative bg-depa-graphite border-y border-depa-panna/10 px-6 md:px-10 py-14 md:py-16 scroll-mt-20"
		>
			<div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
				<m.div
					aria-hidden
					initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
					viewport={{ once: true, amount: 0.6 }}
					transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
					className="shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-sm shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-black/30"
					style={{
						backgroundColor: ROSSO_BOX,
						backgroundImage: 'url(/images/pattern-box-panettone.png)',
						backgroundSize: '90px 90px',
					}}
				/>

				<div className="flex-1">
					{blok.etichetta && (
						<Reveal className="mb-3">
							<span className="text-xs md:text-sm tracking-[0.3em] uppercase text-depa-senape">
								{blok.etichetta}
							</span>
						</Reveal>
					)}
					<Reveal>
						<h2 className="text-3xl md:text-5xl font-light leading-tight text-balance">
							{blok.titolo}{' '}
							<span className="text-depa-senape">{blok.titolo_evidenza}</span>
						</h2>
					</Reveal>
					{(blok.sottotitolo || blok.testo) && (
						<FadeIn delay={0.1}>
							<p className="mt-4 max-w-2xl text-depa-panna/65 font-light leading-relaxed">
								{blok.sottotitolo && <span className="text-depa-oro">{blok.sottotitolo}. </span>}
								{blok.testo}
							</p>
						</FadeIn>
					)}
				</div>

				{blok.bottone && numero && (
					<FadeIn delay={0.15} className="shrink-0">
						<a
							href={link}
							onClick={() => contattoWhatsApp('novita-panettone')}
							target="_blank"
							rel="noreferrer"
							className="inline-block rounded-full border border-depa-senape px-6 py-3 text-sm tracking-[0.1em] uppercase text-depa-senape hover:bg-depa-senape hover:text-depa-black transition-colors"
						>
							{blok.bottone}
						</a>
					</FadeIn>
				)}
			</div>
		</section>
	);
}
