'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal } from './Reveal';
import { imageSrc } from '@/lib/utils';

function Freccia({ direzione, disabilitata, onClick }) {
	return (
		<button
			type="button"
			data-gallery-nav={direzione}
			aria-label={direzione === 'prev' ? 'Foto precedenti' : 'Foto successive'}
			disabled={disabilitata}
			onClick={onClick}
			className="h-12 w-12 flex items-center justify-center rounded-full border border-depa-panna/25 text-depa-panna/80 transition-colors hover:border-depa-senape hover:text-depa-senape disabled:opacity-30 disabled:pointer-events-none"
		>
			<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
				<path d={direzione === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
			</svg>
		</button>
	);
}

export default function Galleria({ blok }) {
	const immagini = (blok.immagini || []).filter((img) => img?.filename);
	const striscia = useRef(null);
	const [inizio, setInizio] = useState(true);
	const [fine, setFine] = useState(false);

	const aggiorna = useCallback(() => {
		const s = striscia.current;
		if (!s) return;
		setInizio(s.scrollLeft < 8);
		setFine(s.scrollLeft + s.clientWidth > s.scrollWidth - 8);
	}, []);

	useEffect(() => {
		aggiorna();
		window.addEventListener('resize', aggiorna);
		return () => window.removeEventListener('resize', aggiorna);
	}, [aggiorna]);

	// Da computer la striscia si scorre con le frecce, di circa una schermata alla volta
	const scorri = (verso) => {
		const s = striscia.current;
		s.scrollBy({ left: verso * Math.max(s.clientWidth * 0.8, 340), behavior: 'smooth' });
	};

	return (
		<section
			{...storyblokEditable(blok)}
			id="galleria"
			className="relative bg-depa-black py-28 md:py-36 scroll-mt-20"
		>
			<div className="px-6 md:px-10">
				<div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
					<Reveal>
						<h2 className="text-4xl md:text-6xl font-light">
							{blok.titolo}{' '}
							<span className="text-depa-senape">{blok.titolo_evidenza}</span>
						</h2>
					</Reveal>
					<div className="flex flex-col md:items-end gap-6">
						{blok.intro && (
							<p className="max-w-sm text-depa-panna/60 font-light">{blok.intro}</p>
						)}
						<div className="hidden md:flex gap-3">
							<Freccia direzione="prev" disabilitata={inizio} onClick={() => scorri(-1)} />
							<Freccia direzione="next" disabilitata={fine} onClick={() => scorri(1)} />
						</div>
					</div>
				</div>
			</div>

			<div
				ref={striscia}
				onScroll={aggiorna}
				className="no-scrollbar gallery-strip flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
			>
				{immagini.map((img, i) => (
					<m.figure
						key={img.id || img.filename}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.8, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
						className="relative shrink-0 snap-start w-[72vw] sm:w-[44vw] md:w-[340px] aspect-[4/5] overflow-hidden rounded-sm"
					>
						<Image
							quality={90}
							src={imageSrc(img)}
							alt={img.alt || ''}
							fill
							sizes="(min-width: 768px) 340px, 72vw"
							className="object-cover transition-transform duration-700 ease-out hover:scale-105"
						/>
					</m.figure>
				))}
			</div>
		</section>
	);
}
