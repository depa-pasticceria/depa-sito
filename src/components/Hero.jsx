'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { imageSrc, lines } from '@/lib/utils';

export default function Hero({ blok }) {
	const headline = lines(blok.titolo);

	return (
		<section
			{...storyblokEditable(blok)}
			id="top"
			className="relative min-h-[100svh] overflow-hidden bg-depa-black"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					background:
						'radial-gradient(60% 50% at 20% 20%, rgba(201,153,44,0.10), transparent 70%)',
				}}
			/>

			<div className="relative z-10 grid min-h-[100svh] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="order-2 lg:order-1 flex flex-col justify-center px-6 md:px-10 py-16 lg:py-24">
					<div className="mx-auto w-full max-w-2xl lg:mx-0 lg:ml-auto lg:pr-12 xl:pr-16">
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.1, duration: 0.8 }}
							className="mb-6 text-xs md:text-sm tracking-[0.35em] uppercase text-depa-senape"
						>
							{blok.sopratitolo}
						</motion.p>

						<h1 className="font-light text-[15vw] leading-[0.95] sm:text-[9vw] lg:text-[4.6vw]">
							{headline.map((line, i) => (
								<span key={line} className="block overflow-hidden">
									<motion.span
										initial={{ y: '100%' }}
										animate={{ y: '0%' }}
										transition={{
											duration: 1,
											delay: 0.15 * i,
											ease: [0.16, 1, 0.3, 1],
										}}
										className={`block ${i === headline.length - 1 ? 'text-depa-senape' : 'text-depa-panna'}`}
									>
										{line}
									</motion.span>
								</span>
							))}
						</h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							className="mt-8 max-w-md text-lg text-depa-panna/70 font-light leading-relaxed text-balance"
						>
							{blok.sottotitolo}
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							className="mt-10 flex flex-wrap gap-4"
						>
							{blok.bottone_principale && (
								<a
									href={blok.link_principale || '#prenota'}
									className="rounded-full bg-depa-senape px-7 py-3.5 text-sm tracking-[0.1em] uppercase text-depa-black hover:bg-depa-oro transition-colors"
								>
									{blok.bottone_principale}
								</a>
							)}
							{blok.bottone_secondario && (
								<a
									href={blok.link_secondario || '#eventi'}
									className="rounded-full border border-depa-panna/30 px-7 py-3.5 text-sm tracking-[0.1em] uppercase text-depa-panna hover:border-depa-panna transition-colors"
								>
									{blok.bottone_secondario}
								</a>
							)}
						</motion.div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, scale: 1.04 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
					className="order-1 lg:order-2 relative min-h-[52vh] lg:min-h-full"
				>
					<Image
						src={imageSrc(blok.immagine, '/images/hero/pasticciere.jpg')}
						alt={
							blok.immagine?.alt ||
							'Il pasticciere Depa mentre decora una torta a mano, Roccapiemonte'
						}
						fill
						priority
						sizes="(min-width: 1024px) 45vw, 100vw"
						className="object-cover object-[center_25%] grayscale-[35%] contrast-[1.05] brightness-[0.85]"
					/>
					<div
						aria-hidden
						className="absolute inset-0"
						style={{
							background:
								'linear-gradient(90deg, rgba(18,18,16,1) 0%, rgba(18,18,16,0.35) 18%, rgba(18,18,16,0) 40%, rgba(18,18,16,0) 75%, rgba(18,18,16,0.55) 100%)',
						}}
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-depa-senape/10 mix-blend-color"
					/>
					<div
						aria-hidden
						className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-depa-black to-transparent lg:hidden"
					/>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5, duration: 1 }}
				className="absolute bottom-8 left-6 md:left-10 z-10 flex flex-col items-center gap-3"
			>
				<span className="text-[10px] tracking-[0.3em] uppercase text-depa-panna/40">
					Scorri
				</span>
				<div className="h-12 w-px overflow-hidden bg-depa-panna/15">
					<motion.div
						className="h-4 w-px bg-depa-senape"
						animate={{ y: ['-16px', '48px'] }}
						transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</div>
			</motion.div>
		</section>
	);
}
