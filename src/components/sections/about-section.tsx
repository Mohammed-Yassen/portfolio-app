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
	type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Locale } from "@prisma/client";
import { AboutData } from "@/types";
import { MotionSection } from "../shared/motion-viewport";

/* ----------------------------- Icons Map ----------------------------- */
const ICON_MAP: Record<string, LucideIcon> = {
	Terminal,
	Layers,
	ShieldCheck,
	Zap,
	Sparkles,
	Cpu,
};

/* ----------------------------- Props ----------------------------- */
interface AboutSectionProps {
	aboutData: AboutData | null;
	locale: Locale;
}

/* ----------------------------- About Section ----------------------------- */
export function AboutSection({ aboutData, locale }: AboutSectionProps) {
	const sectionRef = React.useRef<HTMLElement>(null);
	const isRTL = locale === "ar";

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	// Parallax values
	const yParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);
	const rotateParallax = useTransform(
		scrollYProgress,
		[0, 1],
		isRTL ? [-2, 2] : [2, -2],
	);
	if (!aboutData) return null;

	const { title, subtitle, description } = aboutData.content;

	return (
		<MotionSection
			ref={sectionRef}
			id='about'
			as='section'
			preset='fadeInUp'
			className={cn(
				"relative overflow-hidden py-24 md:py-32",
				isRTL && "direction-rtl text-right",
			)}>
			{/* Ambient Glow */}
			<div
				className={cn(
					"absolute -top-32 size-112 bg-primary/10 blur-[140px] rounded-full -z-10",
					isRTL ? "-left-32" : "-right-32",
				)}
			/>

			{/* Container */}
			<div className='container relative z-10 mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16'>
					{/* Left Content */}
					<div className='lg:col-span-7 lg:sticky lg:top-0 h-fit'>
						<motion.div
							initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, ease: "easeOut" }}
							className='space-y-8'>
							{/* Subtitle */}
							<div
								className={cn(
									"flex items-center gap-4",
									// isRTL && "flex-row-reverse",
								)}>
								<span className='h-px w-10 bg-primary' />
								<span className='text-[11px] font-mono tracking-[0.35em] uppercase text-primary/80'>
									{subtitle}
								</span>
							</div>

							{/* Title */}
							<h2 className='text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[0.95] wf'>
								{isRTL
									? title // Arabic: just show title normally
									: title.split(" ").map((word: string, i: number) => (
											<span
												key={i}
												className={cn(
													"inline-block mr-3",
													word.toLowerCase() === "solutions" &&
														"text-muted-foreground/20 italic font-light",
												)}>
												{word}
											</span>
									  ))}
								<span className='text-primary'>.</span>
							</h2>

							{/* Description */}
							<p
								className={cn(
									"max-w-xl text-lg leading-relaxed text-muted-foreground",
									isRTL
										? "border-s-2 ps-6 border-primary/20"
										: "border-s-2 ps-6 border-primary/20",
								)}>
								{description}
							</p>

							{/* Stats */}
							<div className='grid grid-cols-2 gap-x-12 gap-y-12'>
								{aboutData.statuses.map((status, i) => (
									<motion.div
										key={status.id}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.1 }}
										className='group'>
										<div
											className={cn(
												"flex items-center gap-2 mb-3 text-muted-foreground",
												// isRTL && "flex-row-reverse",
											)}>
											<Plus
												size={14}
												className='group-hover:text-primary group-hover:rotate-90 transition-all duration-500'
											/>
											<span className='text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest'>
												{status.label}
											</span>
										</div>
										<div className='flex items-baseline'>
											<span className='text-3xl font-bold tracking-tighter tabular-nums transition-colors group-hover:text-primary'>
												{status.value}
											</span>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					</div>

					{/* Right Content */}
					<div className='lg:col-span-5 space-y-8'>
						{aboutData.pillars?.map((pillar, index) => {
							const Icon = ICON_MAP[pillar.icon] ?? Sparkles;
							return (
								<motion.div
									key={pillar.id}
									style={{ y: yParallax, rotate: rotateParallax }}
									className='group relative'>
									{/* Glow Border */}
									<div className='absolute -inset-px rounded-3xl bg-gradient-to-r from-transparent via-border to-transparent opacity-50 group-hover:via-primary/40 transition' />

									{/* Card */}
									<div className='relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur p-6 transition-all duration-500 hover:bg-card'>
										<div
											className={cn("flex gap-5", isRTL && "flex-row-reverse")}>
											{/* Icon */}
											<div className='relative shrink-0'>
												<div className='absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity' />
												<div className='relative size-14 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary transition'>
													<Icon size={28} />
												</div>
											</div>

											{/* Pillar Content */}
											<div className='flex-1 space-y-2'>
												<div className='flex items-center justify-between'>
													<h3 className='text-xl font-semibold'>
														{pillar.title}
													</h3>
													<span className='font-mono text-xs text-muted-foreground/30'>
														[{String(index + 1).padStart(2, "0")}]
													</span>
												</div>
												<p className='text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition'>
													{pillar.description}
												</p>
											</div>

											{/* Arrow */}
											<div
												className={cn(
													"hidden xl:flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition",
													isRTL && "group-hover:-rotate-45",
												)}>
												<ArrowUpRight size={18} />
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
