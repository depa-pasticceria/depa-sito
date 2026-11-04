'use client';

import { useState } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal } from './Reveal';
import Lightbox from './Lightbox';
import { imageSrc, lightboxSrc } from '@/lib/utils';

export default function Prodotti({ blok }) {
	const [aperta, setAperta] = useState(null);
	const foto = (blok.prodotti || [])
		.filter((p) => p.immagine?.filename)
		.map((p) => ({
			uid: p._uid,
			// Misura giusta per lo schermo, mai oltre l'originale: nitida anche sui display 3x.
			src: lightboxSrc(imageSrc(p.immagine)),
			alt: p.immagine.alt || p.nome,
			caption: p.nome,
		}));

	return (
		<section
			{...storyblokEditable(blok)}
			id="prodotti"
			className="relative bg-depa-black px-6 md:px-10 py-28 md:py-36 scroll-mt-20"
		>
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
					<Reveal>
						<h2 className="text-4xl md:text-6xl font-light">
							{blok.titolo}{' '}
							<span className="text-depa-senape">{blok.titolo_evidenza}</span>
						</h2>
					</Reveal>
					<p className="max-w-sm text-depa-panna/60 font-light">{blok.intro}</p>
				</div>

				<div>
					{blok.prodotti?.map((p, i) => (
						<m.div
							key={p._uid}
							{...storyblokEditable(p)}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.6, delay: i * 0.05 }}
							className={`group relative grid items-center gap-x-6 md:gap-x-12 gap-y-3 border-t border-depa-panna/10 py-8 md:py-10 last:border-b ${
								p.immagine?.filename
									? 'grid-cols-[auto_1fr_96px] md:grid-cols-[80px_1fr_1fr_168px]'
									: 'grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_1fr]'
							}`}
						>
							<span className="text-sm text-depa-panna/40 tracking-[0.2em]">
								{String(i + 1).padStart(2, '0')}
							</span>
							<h3 className="text-2xl md:text-4xl font-light transition-colors group-hover:text-depa-senape">
								{p.nome}
							</h3>
							{p.immagine?.filename && (
								<button
									type="button"
									onClick={() => setAperta(foto.findIndex((f) => f.uid === p._uid))}
									aria-label={`Ingrandisci la foto: ${p.nome}`}
									className="relative row-span-2 md:row-span-1 md:order-last aspect-[4/5] w-full overflow-hidden rounded-sm cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-depa-senape"
								>
									<Image
										quality={90}
										src={imageSrc(p.immagine)}
										alt={p.immagine.alt || p.nome}
										fill
										sizes="(min-width: 768px) 168px, 96px"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
									<span
										aria-hidden
										className="absolute right-1.5 bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-depa-black/70 text-depa-panna"
									>
										<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
											<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
										</svg>
									</span>
								</button>
							)}
							<p className="col-span-2 md:col-span-1 text-depa-panna/55 font-light leading-relaxed max-w-md">
								{p.descrizione}
							</p>

							<m.div
								aria-hidden
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: i * 0.05 + 0.2, ease: [0.16, 1, 0.3, 1] }}
								className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-depa-senape/60"
							/>
						</m.div>
					))}
				</div>
			</div>

			<Lightbox items={foto} index={aperta} onChange={setAperta} onClose={() => setAperta(null)} />
		</section>
	);
}
