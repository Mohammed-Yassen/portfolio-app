/** @format */

// src/components/reading-progress.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ReadingProgress() {
	const { scrollYProgress } = useScroll();

	// useSpring creates a fluid, elastic movement rather than a linear one
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	return (
		<motion.div
			className='fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]'
			style={{ scaleX }}
		/>
	);
}
