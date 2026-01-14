/** @format */
"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
	ArrowUpRight,
	Plus,
	Sparkles,
	Terminal,
	Layers,
	ShieldCheck,
	Zap,
	Cpu,
	ChevronDown,
	type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Locale } from "@prisma/client";
import { AboutData } from "@/types";
import { MotionSection } from "../shared/motion-viewport";
import { BackgroundRippleEffect } from "../background-ripple-effect";

const ICON_MAP: Record<string, LucideIcon> = {
	Terminal,
	Layers,
	ShieldCheck,
	Zap,
	Sparkles,
	Cpu,
};

export function AboutSection({
	aboutData,
	locale,
}: {
	aboutData: AboutData | null;
	locale: Locale;
}) {
	const [isExpanded, setIsExpanded] = React.useState(false);
	const sectionRef = React.useRef<HTMLElement>(null);
	const isRTL = locale === "ar";

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	// const yParallax = useTransform(scrollYProgress, [0, 1], [0, -60]);
	const rotateParallax = useTransform(scrollYProgress, [0, 1], [2, -2]);

	if (!aboutData) return null;
	const { title, subtitle, description } = aboutData.content;

	const shouldTruncate = description.length > 250;
	const displayedDescription =
		isExpanded || !shouldTruncate
			? description
			: `${description.slice(0, 250)}...`;
	return (
		<MotionSection
			ref={sectionRef}
			id='about'
			as='section'
			className={cn(
				"relative py-24 lg:py-40 overflow-hidden bg-background transition-colors duration-500",
				isRTL && "direction-rtl text-right",
			)}>
			{/* --- BACKGROUND LAYER --- */}
			<div className='absolute inset-0 -z-10 pointer-events-none'>
				{/* Ripple Effect - Barely visible in light mode, subtle in dark */}
				<div className='absolute -z-10 inset-0 opacity-70 dark:opacity-50 pointer-events-none'>
					<BackgroundRippleEffect rows={12} cols={44} cellSize={60} />
				</div>

				{/* Adaptive Glows */}
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl'>
					<div className='absolute top-10 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full' />
					<div className='absolute bottom-10 left-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] rounded-full' />
				</div>
			</div>

			<div className='container relative z-10 mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-start'>
					{/* --- LEFT SIDE: Sticky Content --- */}

					<div className='lg:col-span-6 lg:sticky lg:top-32 space-y-10'>
						<div className='space-y-6'>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								className='inline-flex items-center gap-3'>
								<div className='h-px w-8 bg-indigo-500' />

								<span className='text-[10px] font-bold tracking-[0.3em] uppercase text-indigo-500/80'>
									{subtitle}
								</span>
							</motion.div>

							<h2 className='text-3xl md:text-4xl font-black tracking-tight leading-[0.9] text-foreground'>
								{title.split(" ").map((word, i) => (
									<span
										key={i}
										className={cn(
											"inline-block mr-3",

											(word.toLowerCase() === "imagination" ||
												word.toLowerCase() === "الخيال") &&
												"text-zinc-500/30 italic font-serif font-light",
										)}>
										{word}
									</span>
								))}

								<span className='text-indigo-500'>.</span>
							</h2>

							<div className='relative'>
								<motion.p
									layout
									className='text-base md:text-lg leading-relaxed text-muted-foreground border-l-2 border-indigo-500/20 pl-6'>
									{displayedDescription}
								</motion.p>

								{shouldTruncate && (
									<button
										onClick={() => setIsExpanded(!isExpanded)}
										className='mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors pl-6'>
										{isExpanded ? "Show Less" : "Read More"}

										<ChevronDown
											size={14}
											className={cn(
												"transition-transform",

												isExpanded && "rotate-180",
											)}
										/>
									</button>
								)}
							</div>
						</div>

						{/* Stats Grid */}

						<div className='grid grid-cols-2 gap-8 pt-4'>
							{aboutData.statuses.map((status, i) => (
								<motion.div
									key={status.id}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.1 }}
									className='group'>
									<div className='flex items-center gap-2 mb-1'>
										<Plus
											size={12}
											className='text-indigo-500 group-hover:rotate-90 transition-transform'
										/>

										<span className='text-[9px] font-mono uppercase tracking-tighter text-muted-foreground/60'>
											{status.label}
										</span>
									</div>

									<div className='text-3xl font-black tracking-tighter text-foreground group-hover:text-indigo-500 transition-colors'>
										{status.value}
									</div>
								</motion.div>
							))}
						</div>
					</div>
					{/* --- RIGHT SIDE: Pillar Cards --- */}
					<div className='lg:col-span-6 space-y-6 md:space-y-8'>
						{aboutData.pillars?.map((pillar, idx) => {
							const Icon = ICON_MAP[pillar.icon] ?? Sparkles;
							return (
								<motion.div
									key={pillar.id || idx}
									style={{ y: rotateParallax, rotate: rotateParallax }}
									className='group relative'>
									<div className='absolute -inset-px bg-linear-to-r from-transparent via-border to-transparent rounded-4xl opacity-50 group-hover:via-primary/50 transition-all duration-500' />

									<div className='relative bg-card/50 backdrop-blur-sm border border-border/40 hover:bg-card transition-all duration-500 rounded-4xl p-4 md:p-6'>
										<div className='flex gap-4 items-start'>
											{/* Technical Icon Wrapper */}
											<div className='relative shrink-0'>
												<div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
												<div className='relative size-16 rounded-2xl bg-background border-2 border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-all duration-500'>
													<Icon size={30} strokeWidth={1.5} />
													<div className='absolute -top-1 -right-1 size-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform' />
												</div>
											</div>

											<div className='flex-1 space-y-2'>
												<div className='flex items-center justify-between'>
													<h3 className='text-2xl font-bold tracking-tight'>
														{pillar.title}
													</h3>
													<span className='font-mono text-xs text-muted-foreground/30'>
														[{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}]
													</span>
												</div>
												<p className='text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors'>
													{pillar.description}
												</p>
											</div>

											{/* Action Decoration */}
											<div className='hidden xl:flex size-12 rounded-full border border-border items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:text-primary group-hover:border-primary transition-all duration-500'>
												<ArrowUpRight size={20} />
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</MotionSection>
	);
}
