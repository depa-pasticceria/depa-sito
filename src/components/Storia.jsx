'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal, FadeIn } from './Reveal';
import { imageSrc } from '@/lib/utils';

export default function Storia({ blok }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0.8', 'end 0.4'],
	});
	const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
	const hasImage = Boolean(blok.immagine?.filename);

	return (
		<section
			{...storyblokEditable(blok)}
			id="storia"
			className="relative bg-depa-graphite px-6 md:px-10 py-28 md:py-36 scroll-mt-20"
		>
			<div
				className={`mx-auto ${hasImage ? 'max-w-7xl grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start' : 'max-w-5xl'}`}
			>
				<div>
					<Reveal className="mb-16 md:mb-24">
						<span className="text-xs tracking-[0.3em] uppercase text-depa-senape">
							{blok.etichetta}
						</span>
					</Reveal>

					<div ref={ref} className="relative pl-10 md:pl-16">
						<div className="absolute left-0 top-0 bottom-0 w-px bg-depa-panna/10" />
						<m.div
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

				{hasImage && (
					<FadeIn delay={0.1} className="lg:sticky lg:top-28">
						<div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
							<Image
								quality={90}
								src={imageSrc(blok.immagine)}
								alt={blok.immagine.alt || ''}
								fill
								sizes="(min-width: 1024px) 400px, 100vw"
								className="object-cover object-top"
							/>
						</div>
						{blok.didascalia && (
							<p className="mt-4 text-sm text-depa-panna/50 font-light">{blok.didascalia}</p>
						)}
					</FadeIn>
				)}
			</div>
		</section>
	);
}
