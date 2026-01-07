/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	Download,
	ArrowRight,
	Github,
	Linkedin,
	Mail,
	Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Locale, Availability } from "@prisma/client";
import { MotionSection } from "../shared/motion-viewport";
import { HeroData } from "@/types";

const STATUS_THEMES: Record<
	Availability,
	{ dot: string; ping: string; wrapper: string }
> = {
	AVAILABLE: {
		dot: "bg-emerald-500",
		ping: "bg-emerald-400",
		wrapper:
			"bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	},
	BUSY: {
		dot: "bg-amber-500",
		ping: "bg-amber-400",
		wrapper:
			"bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400",
	},
	OPEN_FOR_COMMISSION: {
		dot: "bg-blue-500",
		ping: "bg-blue-400",
		wrapper:
			"bg-blue-500/5 border-blue-500/10 text-blue-600 dark:text-blue-400",
	},
	ON_LEAVE: {
		dot: "bg-red-500",
		ping: "bg-red-400",
		wrapper: "bg-red-500/5 border-red-500/10 text-red-600 dark:text-red-400",
	},
};

interface HeroSectionProps {
	data: HeroData | null;
	locale: Locale;
}

export const HeroSection = ({ data, locale }: HeroSectionProps) => {
	const t = useTranslations("Hero");
	const router = useRouter();
	const isRtl = locale === "ar";

	useEffect(() => {
		const bc = new BroadcastChannel("portfolio_updates");
		bc.onmessage = (msg) => msg.data === "refresh" && router.refresh();
		return () => bc.close();
	}, [router]);

	if (!data) return null;

	const { content, primaryImage, resumeUrl, availability } = data;
	const theme = STATUS_THEMES[availability] || STATUS_THEMES.AVAILABLE;

	return (
		<MotionSection
			as='section'
			id='hero'
			dir={isRtl ? "rtl" : "ltr"}
			className='relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden'>
			{/* Background Engineering - Softened */}
			<div className='absolute inset-0 z-0 pointer-events-none'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05)_0,transparent_50%)]' />
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10 dark:opacity-20" />
			</div>

			<div className='container relative z-10 px-6 mx-auto'>
				<div className='flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16'>
					{/* --- TEXT CONTENT --- */}
					<div className='flex-1 space-y-8 text-center lg:text-start order-2 lg:order-1'>
						<div className='space-y-5'>
							{/* Status Badge - Slimmer */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className={cn(
									"inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md",
									theme.wrapper,
								)}>
								<span className='relative flex h-2 w-2'>
									<span
										className={cn(
											"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
											theme.ping,
										)}
									/>
									<span
										className={cn(
											"relative inline-flex rounded-full h-2 w-2",
											theme.dot,
										)}
									/>
								</span>
								<span className='text-[10px] font-bold uppercase tracking-[0.15em]'>
									{t(`status.${availability}`)}
								</span>
							</motion.div>

							{/* Main Title - Adjusted Scale */}
							<h1 className='text-5xl md:text-6xl lg:text-6xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white'>
								{content.greeting} <br />
								<span className='bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent'>
									{content.name}
								</span>
							</h1>

							{/* Roles - Refined Pill Style */}
							<div className='flex flex-wrap justify-center lg:justify-start gap-2 pt-1'>
								{content.role.split("&&").map((r, i) => (
									<div
										key={i}
										className='flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 rounded-lg text-xs font-semibold border border-zinc-200/50 dark:border-zinc-700/30'>
										<Sparkles size={12} className='text-indigo-400' />
										{r.trim()}
									</div>
								))}
							</div>

							<p className='text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal'>
								{content.description}
							</p>
						</div>

						{/* Action Buttons - More Balanced Sizes */}
						<div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4'>
							<Button
								size='lg'
								className='h-14 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:scale-95 text-base font-bold group'>
								{content.ctaText}
								<ArrowRight
									className={cn(
										"ms-2 w-4 h-4 transition-transform group-hover:translate-x-1",
										isRtl && "rotate-180 group-hover:-translate-x-1",
									)}
								/>
							</Button>

							<Button
								variant='outline'
								size='lg'
								asChild
								className='h-14 px-8 rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all text-base font-bold'>
								<a
									href={resumeUrl || "#"}
									target='_blank'
									rel='noopener noreferrer'>
									<Download size={18} className='me-2 text-zinc-400' />
									{t("cv_button")}
								</a>
							</Button>
						</div>

						{/* Social Links - Integrated better */}
						<div className='flex justify-center lg:justify-start gap-6 pt-8'>
							<div className='flex items-center gap-4'>
								<SocialIcon href='#' icon={<Github size={20} />} />
								<SocialIcon href='#' icon={<Linkedin size={20} />} />
							</div>
							<div className='h-4 w-px bg-zinc-200 dark:bg-zinc-800' />
							<a
								href='mailto:contact@example.com'
								className='flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors'>
								<Mail size={20} />
								{t("talk_button")}
							</a>
						</div>
					</div>

					{/* --- IMAGE CONTAINER --- */}
					<motion.div
						initial={{ opacity: 0, x: 20, scale: 0.95 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						transition={{
							duration: 0.8,
							ease: [0.16, 1, 0.3, 1], // Custom "Senior" quintic easing
						}}
						className='relative order-1 lg:order-2 group'>
						<motion.div
							// Subtle floating animation while standing still
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 5,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className='relative w-74 h-74 md:w-90 md:h-90 lg:w-105 lg:h-105'>
							{/* Animated Glow: Rotates and pulses for a tech-heavy feel */}
							<motion.div
								animate={{
									rotate: [0, 360],
									scale: [1, 1.1, 1],
								}}
								transition={{
									duration: 10,
									repeat: Infinity,
									ease: "linear",
								}}
								className='absolute -inset-6 bg-linear-to-tr from-indigo-500/30 via-cyan-400/20 to-purple-500/30 blur-3xl rounded-full opacity-60'
							/>

							{/* Image Container with Hover Tilt Effect */}
							<motion.div
								whileHover={{
									scale: 1.02,
									rotateY: 5,
									rotateX: -5,
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className='relative w-full h-full rounded-[2.5rem] overflow-hidden border border-zinc-200/50 dark:border-zinc-700/30 shadow-2xl backdrop-blur-sm'>
								<Image
									src={primaryImage || "/profile.png"}
									alt={content.name}
									fill
									className='object-cover transition-transform duration-700 group-hover:scale-110'
									priority
								/>

								{/* Senior Detail: Dynamic Gradient Overlay that reacts to hover */}
								<div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500' />

								{/* Subtle light streak across the image */}
								<motion.div
									initial={{ x: "-100%" }}
									animate={{ x: "200%" }}
									transition={{
										duration: 3,
										repeat: Infinity,
										repeatDelay: 5,
										ease: "linear",
									}}
									className='absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12'
								/>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</MotionSection>
	);
};

const SocialIcon = ({
	href,
	icon,
}: {
	href: string;
	icon: React.ReactNode;
}) => (
	<Link
		href={href}
		target='_blank'
		className='text-zinc-400 hover:text-indigo-500 transition-colors duration-300'>
		{icon}
	</Link>
);
