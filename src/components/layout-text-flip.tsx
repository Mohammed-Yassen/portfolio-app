/** @format */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const ModernStaggerFlip = ({
	label,
	words = [],
	duration = 3000,
	className,
}: {
	label: React.ReactNode;
	words: string[];
	duration?: number;
	className?: string;
}) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (words.length <= 1) return;
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % words.length);
		}, duration);
		return () => clearInterval(interval);
	}, [words.length, duration]);

	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-800/30 backdrop-blur-sm rounded-lg border border-zinc-200/50 dark:border-zinc-700/30 shadow-sm",
				className,
			)}>
			<div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium'>
				{label}
			</div>

			<div className='relative flex overflow-hidden py-0.5'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={index}
						initial='initial'
						animate='animate'
						exit='exit'
						className='flex'>
						{words[index].split("").map((char, i) => (
							<motion.span
								key={i}
								variants={{
									initial: { y: 15, opacity: 0 },
									animate: { y: 0, opacity: 1 },
									exit: { y: -15, opacity: 0 },
								}}
								transition={{
									duration: 0.3,
									delay: i * 0.03, // The "Intelligent" stagger delay
									ease: [0.215, 0.61, 0.355, 1],
								}}
								className='inline-block whitespace-pre text-indigo-500 dark:text-indigo-400 text-md font-bold'>
								{char}
							</motion.span>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
