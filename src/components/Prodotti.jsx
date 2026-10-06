'use client';

import { motion } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal } from './Reveal';

export default function Prodotti({ blok }) {
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
						<motion.div
							key={p._uid}
							{...storyblokEditable(p)}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.6, delay: i * 0.05 }}
							className="group relative grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr_1fr] items-center gap-x-6 md:gap-x-12 gap-y-3 border-t border-depa-panna/10 py-8 md:py-10 last:border-b"
						>
							<span className="text-sm text-depa-panna/40 tracking-[0.2em]">
								{String(i + 1).padStart(2, '0')}
							</span>
							<h3 className="text-2xl md:text-4xl font-light transition-colors group-hover:text-depa-senape">
								{p.nome}
							</h3>
							<p className="col-span-2 md:col-span-1 text-depa-panna/55 font-light leading-relaxed max-w-md">
								{p.descrizione}
							</p>

							<motion.div
								aria-hidden
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: i * 0.05 + 0.2, ease: [0.16, 1, 0.3, 1] }}
								className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-depa-senape/60"
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
