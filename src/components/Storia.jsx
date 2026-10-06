'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal } from './Reveal';

export default function Storia({ blok }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0.8', 'end 0.4'],
	});
	const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

	return (
		<section
			{...storyblokEditable(blok)}
			id="storia"
			className="relative bg-depa-graphite px-6 md:px-10 py-28 md:py-36 scroll-mt-20"
		>
			<div className="mx-auto max-w-5xl">
				<Reveal className="mb-16 md:mb-24">
					<span className="text-xs tracking-[0.3em] uppercase text-depa-senape">
						{blok.etichetta}
					</span>
				</Reveal>

				<div ref={ref} className="relative pl-10 md:pl-16">
					<div className="absolute left-0 top-0 bottom-0 w-px bg-depa-panna/10" />
					<motion.div
						style={{ height: lineHeight }}
						className="absolute left-0 top-0 w-px bg-depa-senape"
					/>

					<div className="flex flex-col gap-16 md:gap-24">
						{blok.paragrafi?.map((p, i) => (
							<Reveal key={p._uid} delay={0.05}>
								<p
									{...storyblokEditable(p)}
									className={
										i === 0
											? 'text-2xl md:text-4xl font-light leading-snug text-balance'
											: 'text-xl md:text-2xl font-light leading-relaxed text-depa-panna/70 text-balance'
									}
								>
									{p.testo}
								</p>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
