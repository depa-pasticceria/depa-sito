'use client';

import Image from 'next/image';
import { useSettings } from '@/components/SettingsProvider';
import { imageSrc, lines } from '@/lib/utils';

export default function Footer() {
	const settings = useSettings();
	const navItems = [
		...settings.menu,
		{
			_uid: 'cta',
			etichetta: settings.cta_etichetta,
			link: settings.cta_link,
		},
	];

	return (
		<footer className="bg-depa-black px-6 md:px-10 py-12 border-t border-depa-panna/10">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
					<div className="relative h-8 w-24">
						<Image
							src={imageSrc(
								settings.logo,
								'/images/logo/depa-mark-bianco-transparent.png',
							)}
							alt={settings.nome}
							fill
							sizes="112px"
							className="object-contain object-left"
						/>
					</div>

					<nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-[0.15em] uppercase text-depa-panna/50">
						{navItems.map((item) => (
							<a
								key={item._uid}
								href={item.link}
								className="hover:text-depa-panna"
							>
								{item.etichetta}
							</a>
						))}
					</nav>

					<p className="text-xs text-depa-panna/30">
						&copy; {new Date().getFullYear()} {settings.nome} &middot;{' '}
						{settings.citta} ({settings.provincia})
					</p>
				</div>

				<p className="mt-8 pt-6 border-t border-depa-panna/5 text-[11px] text-depa-panna/25">
					Zone servite: {lines(settings.zone_servite).join(' · ')}.
				</p>
			</div>
		</footer>
	);
}
