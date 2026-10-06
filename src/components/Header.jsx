'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/components/SettingsProvider';
import { imageSrc } from '@/lib/utils';

export default function Header() {
	const settings = useSettings();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
				scrolled
					? 'bg-depa-black/85 backdrop-blur-md border-b border-depa-panna/10'
					: 'bg-transparent'
			}`}
		>
			<div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
				<a href="#top" className="relative h-9 w-28">
					<Image
						src={imageSrc(
							settings.logo,
							'/images/logo/depa-mark-bianco-transparent.png',
						)}
						alt={settings.nome}
						fill
						sizes="112px"
						className="object-contain object-left"
						priority
					/>
				</a>

				<nav className="hidden md:flex items-center gap-10">
					{settings.menu.map((item) => (
						<a
							key={item._uid}
							href={item.link}
							className="group relative text-sm tracking-[0.15em] uppercase text-depa-panna/80 hover:text-depa-panna transition-colors"
						>
							{item.etichetta}
							<span className="absolute -bottom-1 left-0 h-px w-0 bg-depa-senape transition-all duration-300 group-hover:w-full" />
						</a>
					))}
					<a
						href={settings.cta_link}
						className="rounded-full border border-depa-senape px-5 py-2 text-sm tracking-[0.1em] uppercase text-depa-senape hover:bg-depa-senape hover:text-depa-black transition-colors"
					>
						{settings.cta_etichetta}
					</a>
				</nav>

				<button
					aria-label="Menu"
					onClick={() => setOpen((v) => !v)}
					className="md:hidden flex flex-col gap-1.5 w-8"
				>
					<span
						className={`h-px w-full bg-depa-panna transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`}
					/>
					<span
						className={`h-px w-full bg-depa-panna transition-opacity ${open ? 'opacity-0' : ''}`}
					/>
					<span
						className={`h-px w-full bg-depa-panna transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
					/>
				</button>
			</div>

			<AnimatePresence>
				{open && (
					<motion.nav
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
						className="md:hidden overflow-hidden bg-depa-black border-b border-depa-panna/10"
					>
						<div className="flex flex-col px-6 py-6 gap-5">
							{[
								...settings.menu,
								{
									_uid: 'cta',
									etichetta: settings.cta_etichetta,
									link: settings.cta_link,
								},
							].map((item) => (
								<a
									key={item._uid}
									href={item.link}
									onClick={() => setOpen(false)}
									className="text-lg tracking-wide uppercase text-depa-panna/90"
								>
									{item.etichetta}
								</a>
							))}
						</div>
					</motion.nav>
				)}
			</AnimatePresence>
		</header>
	);
}
