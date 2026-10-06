'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { Reveal, FadeIn } from './Reveal';
import { imageSrc, lines } from '@/lib/utils';

export default function Eventi({ blok }) {
	return (
		<section
			{...storyblokEditable(blok)}
			id="eventi"
			className="relative bg-depa-black px-6 md:px-10 py-28 md:py-36 overflow-hidden scroll-mt-20"
		>
			<div className="mx-auto max-w-7xl">
				<div className="grid md:grid-cols-2 gap-16 md:gap-12 items-start">
					<div>
						<Reveal>
							<h2 className="text-4xl md:text-6xl font-light mb-8">
								{lines(blok.titolo).map((line) => (
									<span key={line} className="block">
										{line}
									</span>
								))}
								<span className="block">
									{blok.titolo_secondaria}{' '}
									<span className="text-depa-senape">{blok.titolo_evidenza}</span>
								</span>
							</h2>
						</Reveal>
						<FadeIn delay={0.1}>
							<p className="text-depa-panna/60 font-light leading-relaxed max-w-md mb-12">
								{blok.intro}
							</p>
						</FadeIn>

						<div className="flex flex-col gap-6">
							{blok.eventi?.map((e, i) => (
								<FadeIn key={e._uid} delay={0.15 + i * 0.08}>
									<div
										{...storyblokEditable(e)}
										className="border-l-2 border-depa-senape/40 pl-6 py-1"
									>
										<h3 className="text-lg tracking-wide uppercase text-depa-panna mb-1">
											{e.nome}
										</h3>
										<p className="text-depa-panna/55 font-light">{e.descrizione}</p>
									</div>
								</FadeIn>
							))}
						</div>

						{blok.bottone && (
							<FadeIn delay={0.4} className="mt-12">
								<a
									href={blok.link || '#prenota'}
									className="inline-block rounded-full bg-depa-senape px-7 py-3.5 text-sm tracking-[0.1em] uppercase text-depa-black hover:bg-depa-oro transition-colors"
								>
									{blok.bottone}
								</a>
							</FadeIn>
						)}
					</div>

					<div className="relative h-[520px] md:h-[640px]">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
							className="absolute right-0 top-0 w-[72%] h-[62%] rounded-sm overflow-hidden shadow-2xl shadow-black/60"
						>
							<Image
								src={imageSrc(blok.immagine_1, '/images/eventi/torta-cerimonia-1.jpeg')}
								alt={
									blok.immagine_1?.alt ||
									'Torta da cerimonia con frutti di bosco, Depa Pastryshop'
								}
								fill
								className="object-cover"
								sizes="(min-width: 768px) 40vw, 80vw"
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
							className="absolute left-0 bottom-0 w-[62%] h-[52%] rounded-sm overflow-hidden shadow-2xl shadow-black/60 border-4 border-depa-black"
						>
							<Image
								src={imageSrc(blok.immagine_2, '/images/eventi/torta-cerimonia-2.jpeg')}
								alt={
									blok.immagine_2?.alt ||
									'Dettaglio torta multipiano per cerimonie, Depa Pastryshop'
								}
								fill
								className="object-cover"
								sizes="(min-width: 768px) 30vw, 70vw"
							/>
						</motion.div>
						<div
							aria-hidden
							className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full border border-depa-senape/30"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
