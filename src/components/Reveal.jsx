'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function useInViewOnce() {
	const ref = useRef(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return { ref, inView };
}

export function Reveal({ children, delay = 0, className }) {
	const { ref, inView } = useInViewOnce();
	return (
		<div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
			<motion.div
				initial={{ y: '110%' }}
				animate={{ y: inView ? '0%' : '110%' }}
				transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
			>
				{children}
			</motion.div>
		</div>
	);
}

export function FadeIn({ children, delay = 0, className }) {
	const { ref, inView } = useInViewOnce();
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 24 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
			transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
