'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { cubicBezier, m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { storyblokEditable } from '@storyblok/react/rsc';
import { useSettings } from '@/components/SettingsProvider';
import { lines } from '@/lib/utils';

// Le paste partono sparse attorno al titolo e, scorrendo, si posano una alla volta sul vassoio.
// Tutto il movimento passa da una sola variabile CSS per pasta (--t da 0 a 1): solo transform e
// opacity, quindi lavora la scheda video e lo scroll resta fluido anche su smartphone.
//
// Unità: --tw è la larghezza del vassoio. Posizione finale (ex, ey) e larghezza (w) sono frazioni
// di --tw; la posizione di partenza (sx in vw, sy in svh) è riferita al centro del vassoio.
// Su smartphone (m) le paste partono sopra e sotto il titolo, per non coprirlo.
const PASTE = [
	// fila dietro
	{ src: 'bigne-pistacchio', sxm: -32, sym: -40, w: 0.14, ex: -0.12, ey: -0.085, sx: -36, sy: -40, sr: -18 },
	{ src: 'choux-crema', sxm: 32, sym: -39, w: 0.12, ex: 0.12, ey: -0.085, sx: 34, sy: -42, sr: 14 },
	// fila centrale
	{ src: 'cannolo', sxm: -30, sym: 0, w: 0.2, ex: -0.3, ey: 0, sx: -44, sy: -14, sr: 22 },
	{ src: 'bigne-cioccolato', sxm: 2, sym: -42, w: 0.15, ex: -0.1, ey: 0, sx: -26, sy: -28, sr: -10 },
	{ src: 'baba-panna', sxm: 28, sym: -1, w: 0.115, ex: 0.1, ey: 0, sx: 26, sy: -24, sr: 12 },
	{ src: 'cupola', sxm: 32, sym: 12, w: 0.15, ex: 0.3, ey: 0, sx: 44, sy: -12, sr: -16 },
	// fila davanti
	{ src: 'sfogliatella', sxm: -32, sym: 13, w: 0.2, ex: -0.21, ey: 0.095, sx: -38, sy: 14, sr: -24 },
	{ src: 'fetta', sxm: -20, sym: 30, w: 0.14, ex: 0, ey: 0.1, sx: 4, sy: 22, sr: 8 },
	{ src: 'zeppola', sxm: 24, sym: 30, w: 0.16, ex: 0.21, ey: 0.095, sx: 38, sy: 12, sr: 18 },
];

const ATTERRAGGIO = cubicBezier(0.3, 1.22, 0.6, 1); // piccolo rimbalzo quando la pasta tocca il vassoio
const MORBIDO = cubicBezier(0.22, 1, 0.36, 1);

function Pasta({ pasta, index, progress, statico }) {
	const start = 0.3 + index * 0.045;
	const t = useTransform(progress, [start, start + 0.22], [0, 1], { ease: ATTERRAGGIO });
	const deriva = useTransform(progress, [0, start], [0, -10]);

	return (
		<m.div
			className="pasta absolute left-1/2 top-[60%] will-change-transform"
			style={{
				'--t': statico ? 1 : t,
				'--dy': statico ? 0 : deriva,
				'--ex': pasta.ex,
				'--ey': pasta.ey,
				'--sxd': pasta.sx,
				'--syd': pasta.sy,
				'--sxm': pasta.sxm,
				'--sym': pasta.sym,
				'--sr': pasta.sr,
				width: `calc(var(--tw) * ${pasta.w} * var(--k))`,
				zIndex: Math.round((pasta.ey + 0.2) * 100),
				transform: `translate(-50%, -88%)
					translate(
						calc(var(--sx) * 1vw * (1 - var(--t)) + var(--ex) * var(--tw) * var(--t)),
						calc((var(--sy) + var(--dy)) * 1svh * (1 - var(--t)) + var(--ey) * var(--tw) * var(--t))
					)
					rotate(calc(var(--sr) * 1deg * (1 - var(--t))))
					scale(calc(1.45 - 0.45 * var(--t)))`,
			}}
		>
			{/* Ombra di appoggio: compare solo quando la pasta si posa */}
			<span
				aria-hidden
				className="absolute left-[8%] right-[8%] -bottom-[6%] h-[22%] rounded-[50%]"
				style={{
					opacity: 'calc(var(--t) * 0.9)',
					background: 'radial-gradient(closest-side, rgba(40,22,6,0.55), transparent)',
				}}
			/>
			<Image
				quality={90}
				src={`/images/vassoio/${pasta.src}.webp`}
				alt=""
				width={800}
				height={800}
				sizes="(min-width: 768px) 400px, 140px"
				className="relative h-auto w-full select-none pointer-events-none"
			/>
		</m.div>
	);
}

// Coordinate arrotondate: server e browser devono produrre lo stesso identico SVG.
const r2 = (n) => Math.round(n * 100) / 100;

// Vassoio dorato con centrino di carta, disegnato in SVG (nessuna immagine da scaricare).
function VassoioSvg() {
	const smerli = Array.from({ length: 60 }, (_, i) => {
		const a = (i / 60) * Math.PI * 2;
		return { cx: r2(500 + 432 * Math.cos(a)), cy: r2(206 + 166 * Math.sin(a)) };
	});
	const trafori = (k, n) =>
		Array.from({ length: n }, (_, i) => {
			const a = (i / n) * Math.PI * 2;
			return { cx: r2(500 + 432 * k * Math.cos(a)), cy: r2(206 + 166 * k * Math.sin(a)), a: r2((a * 180) / Math.PI) };
		});

	return (
		<svg viewBox="0 0 1000 430" className="w-full h-auto" aria-hidden>
			<defs>
				<linearGradient id="oro" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#f3d68e" />
					<stop offset="0.45" stopColor="#c99a3e" />
					<stop offset="0.7" stopColor="#e9c672" />
					<stop offset="1" stopColor="#a8792a" />
				</linearGradient>
				<radialGradient id="carta" cx="0.5" cy="0.4" r="0.7">
					<stop offset="0" stopColor="#fbf8f2" />
					<stop offset="1" stopColor="#ece4d6" />
				</radialGradient>
			</defs>
			<ellipse cx="500" cy="232" rx="496" ry="196" fill="#6e4a17" />
			<ellipse cx="500" cy="214" rx="496" ry="196" fill="url(#oro)" />
			<ellipse cx="500" cy="214" rx="470" ry="182" fill="none" stroke="#fff3cf" strokeOpacity="0.35" strokeWidth="3" />
			<g fill="url(#carta)">
				{smerli.map((s, i) => (
					<circle key={i} cx={s.cx} cy={s.cy} r="17" />
				))}
				<ellipse cx="500" cy="206" rx="432" ry="166" />
			</g>
			<g fill="#ddd2bf">
				{trafori(0.86, 48).map((p, i) => (
					<ellipse key={i} cx={p.cx} cy={p.cy} rx="9" ry="3.6" transform={`rotate(${p.a + 90} ${p.cx} ${p.cy})`} />
				))}
				{trafori(0.7, 36).map((p, i) => (
					<circle key={i} cx={p.cx} cy={p.cy} r="3.2" />
				))}
			</g>
			<ellipse cx="500" cy="206" rx="250" ry="96" fill="none" stroke="#ddd2bf" strokeWidth="2" strokeDasharray="2 8" />
		</svg>
	);
}

export default function Vassoio({ blok }) {
	const settings = useSettings();
	const ref = useRef(null);
	const statico = useReducedMotion();
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

	const titoloY = useTransform(scrollYProgress, [0.08, 0.3], ['0svh', '-15svh'], { ease: MORBIDO });
	const titoloScala = useTransform(scrollYProgress, [0.08, 0.3], [1, 0.62], { ease: MORBIDO });
	const vassoioY = useTransform(scrollYProgress, [0.14, 0.38], ['45svh', '0svh'], { ease: MORBIDO });
	const vassoioOpacita = useTransform(scrollYProgress, [0.14, 0.3], [0, 1]);
	const finaleOpacita = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);
	const finaleY = useTransform(scrollYProgress, [0.84, 0.95], [24, 0]);

	const numero = String(settings.whatsapp || '').replace(/\D/g, '');
	const link = `https://wa.me/${numero}?text=${encodeURIComponent(blok.messaggio_whatsapp || '')}`;

	return (
		<section
			{...storyblokEditable(blok)}
			ref={ref}
			id="vassoio"
			className={`relative bg-depa-black ${statico ? '' : 'h-[300svh]'}`}
		>
			<div
				className={`${statico ? 'relative py-28' : 'sticky top-0 h-[100svh]'} overflow-hidden`}
				// Il vassoio si adatta anche all'altezza dello schermo, così titolo, vassoio e testo
				// stanno sempre tutti nella stessa schermata senza sovrapporsi (portatili bassi, smartphone).
				style={{ '--tw': 'min(820px, 92vw, calc((100svh - 360px) * 1.25))' }}
			>
				{/* Luce calda da vetrina dietro al vassoio */}
				<div
					aria-hidden
					className="absolute inset-0"
					style={{
						background:
							'radial-gradient(55% 45% at 50% 62%, rgba(232,197,101,0.16), transparent 70%), radial-gradient(90% 60% at 50% 100%, rgba(201,153,44,0.08), transparent)',
					}}
				/>

				<div className={statico ? 'relative h-[100svh]' : 'absolute inset-0'}>
					<m.div
						className="absolute inset-x-0 top-[36%] -translate-y-1/2 px-6 text-center z-[60] pointer-events-none"
						style={statico ? { y: '-15svh', scale: 0.62 } : { y: titoloY, scale: titoloScala }}
					>
						{blok.etichetta && (
							<p className="mb-5 text-xs md:text-sm tracking-[0.35em] uppercase text-depa-senape">
								{blok.etichetta}
							</p>
						)}
						<h2 className="text-5xl sm:text-7xl md:text-8xl font-light leading-[0.95]">
							{lines(blok.titolo).map((riga, i, tutte) => (
								<span key={riga} className={`block ${i === tutte.length - 1 ? 'text-depa-senape' : ''}`}>
									{riga}
								</span>
							))}
						</h2>
					</m.div>

					<m.div
						className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
						style={{
							width: 'var(--tw)',
							y: statico ? 0 : vassoioY,
							opacity: statico ? 1 : vassoioOpacita,
						}}
					>
						<VassoioSvg />
					</m.div>

					{PASTE.map((pasta, i) => (
						<Pasta key={pasta.src} pasta={pasta} index={i} progress={scrollYProgress} statico={statico} />
					))}

					<m.div
						className="vassoio-finale absolute inset-x-0 px-6 text-center z-[60]"
						style={{
							// Agganciato sotto il bordo del vassoio, non al fondo dello schermo
							top: 'calc(60% + var(--tw) * 0.25)',
							...(statico ? {} : { opacity: finaleOpacita, y: finaleY }),
						}}
					>
						{blok.testo && (
							<p className="mx-auto max-w-xl text-base md:text-lg font-light leading-relaxed text-depa-panna/75 text-balance">
								{blok.testo}
							</p>
						)}
						{blok.bottone && numero && (
							<a
								href={link}
								target="_blank"
								rel="noreferrer"
								className="mt-6 inline-block rounded-full bg-depa-senape px-7 py-3.5 text-sm tracking-[0.1em] uppercase text-depa-black hover:bg-depa-oro transition-colors"
							>
								{blok.bottone}
							</a>
						)}
					</m.div>
				</div>
			</div>
		</section>
	);
}
