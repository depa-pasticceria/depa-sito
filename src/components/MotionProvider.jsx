'use client';

import { LazyMotion } from 'framer-motion';

// Le funzioni di animazione (domMax, serve anche per layoutId del modulo Prenota) si caricano
// dopo il primo rendering: meno JavaScript da eseguire all'avvio, pagina interattiva prima.
const caricaAnimazioni = () => import('./motion-features').then((modulo) => modulo.default);

export default function MotionProvider({ children }) {
	return (
		<LazyMotion features={caricaAnimazioni} strict>
			{children}
		</LazyMotion>
	);
}
