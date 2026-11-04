'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';

// Foto a schermo intero. Usa il file originale (niente ricompressione) e si chiude con tap sullo sfondo, X o Esc.
export default function Lightbox({ items, index, onChange, onClose }) {
	const open = index !== null && index !== undefined;
	const item = open ? items[index] : null;
	const touchStart = useRef(null);
	const closeRef = useRef(null);
	const [caricata, setCaricata] = useState(null);

	const go = useCallback(
		(step) => onChange((index + step + items.length) % items.length),
		[index, items.length, onChange],
	);

	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowRight') go(1);
			if (e.key === 'ArrowLeft') go(-1);
		};
		const overflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		closeRef.current?.focus();
		return () => {
			document.body.style.overflow = overflow;
			window.removeEventListener('keydown', onKey);
		};
	}, [open, go, onClose]);

	// Precarica la foto precedente e la successiva per scorrere senza attese.
	useEffect(() => {
		if (!open || items.length < 2) return;
		for (const step of [1, -1]) {
			const img = new window.Image();
			img.src = items[(index + step + items.length) % items.length].src;
		}
	}, [open, index, items]);

	if (typeof document === 'undefined') return null;

	return createPortal(
		<AnimatePresence>
			{open && (
				<m.div
					role="dialog"
					aria-modal="true"
					aria-label={item.caption}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="fixed inset-0 z-[60] flex flex-col bg-depa-black/95"
					onClick={onClose}
					onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
					onTouchEnd={(e) => {
						if (touchStart.current === null || items.length < 2) return;
						const dx = e.changedTouches[0].clientX - touchStart.current;
						touchStart.current = null;
						if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
					}}
				>
					<div className="flex items-center justify-between px-4 md:px-8 h-16 shrink-0">
						<span className="text-xs tracking-[0.2em] uppercase text-depa-panna/60">
							{index + 1} / {items.length}
						</span>
						<button
							ref={closeRef}
							type="button"
							aria-label="Chiudi"
							onClick={onClose}
							className="h-11 w-11 -mr-2 flex items-center justify-center text-depa-panna/80 hover:text-depa-panna"
						>
							<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5">
								<path d="M5 5l14 14M19 5L5 19" />
							</svg>
						</button>
					</div>

					<div className="relative flex-1 min-h-0 flex items-center justify-center px-2 md:px-20">
						{caricata !== item.src && (
							<span
								aria-hidden
								className="absolute h-8 w-8 rounded-full border-2 border-depa-panna/20 border-t-depa-senape animate-spin"
							/>
						)}
						<m.img
							key={item.src}
							src={item.src}
							alt={item.alt}
							initial={{ opacity: 0, scale: 0.98 }}
							animate={caricata === item.src ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
							transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							onLoad={() => setCaricata(item.src)}
							ref={(el) => {
								if (el?.complete && el.naturalWidth && caricata !== item.src) setCaricata(item.src);
							}}
							onClick={(e) => e.stopPropagation()}
							className="max-h-full max-w-full object-contain rounded-sm select-none"
						/>

						{items.length > 1 && (
							<>
								<button
									type="button"
									aria-label="Foto precedente"
									onClick={(e) => {
										e.stopPropagation();
										go(-1);
									}}
									className="hidden md:flex absolute left-4 h-12 w-12 items-center justify-center rounded-full border border-depa-panna/20 text-depa-panna/80 hover:border-depa-senape hover:text-depa-senape"
								>
									<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
										<path d="M15 5l-7 7 7 7" />
									</svg>
								</button>
								<button
									type="button"
									aria-label="Foto successiva"
									onClick={(e) => {
										e.stopPropagation();
										go(1);
									}}
									className="hidden md:flex absolute right-4 h-12 w-12 items-center justify-center rounded-full border border-depa-panna/20 text-depa-panna/80 hover:border-depa-senape hover:text-depa-senape"
								>
									<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
										<path d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</>
						)}
					</div>

					<p className="shrink-0 px-6 py-5 text-center text-lg font-light text-depa-panna">
						{item.caption}
					</p>
				</m.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
