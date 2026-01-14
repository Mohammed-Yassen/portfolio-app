/** @format */
"use client";

import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";
import {
	ArrowRight,
	Download,
	Github,
	Linkedin,
	Mail,
	Twitter,
	ExternalLink,
	Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Availability, Locale, SocialLinks } from "@prisma/client";
import { MotionSection } from "../shared/motion-viewport";
import { HeroData } from "@/types";
import { ModernStaggerFlip } from "../layout-text-flip";

/* -------------------------------------------------------------------------- */
/* ANIMATIONS                               */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.12, delayChildren: 0.2 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 15 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
	},
};

const ICON_MAP: Record<string, JSX.Element> = {
	github: <Github size={18} />,
	linkedin: <Linkedin size={18} />,
	twitter: <Twitter size={18} />,
	default: <ExternalLink size={18} />,
};
const STATUS_THEMES: Record<
	Availability,
	{ dot: string; ping: string; wrapper: string }
> = {
	AVAILABLE: {
		dot: "bg-emerald-500",
		ping: "bg-emerald-400",
		wrapper: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
	},
	BUSY: {
		dot: "bg-amber-500",
		ping: "bg-amber-400",
		wrapper: "bg-amber-500/10 border-amber-500/20 text-amber-400",
	},
	OPEN_FOR_COMMISSION: {
		dot: "bg-blue-500",
		ping: "bg-blue-400",
		wrapper: "bg-blue-500/10 border-blue-500/20 text-blue-400",
	},
	ON_LEAVE: {
		dot: "bg-red-500",
		ping: "bg-red-400",
		wrapper: "bg-red-500/10 border-red-500/20 text-red-400",
	},
	UNAVAILABLE: {
		dot: "bg-gray-500",
		ping: "bg-gray-400",
		wrapper: "bg-gray-500/10 border-gray-500/20 text-gray-400",
	},
	CLOSED: {
		dot: "bg-red-500",
		ping: "bg-red-400",
		wrapper: "bg-red-500/10 border-red-500/20 text-red-400",
	},
	OTHER: {
		dot: "bg-purple-500",
		ping: "bg-purple-400",
		wrapper: "bg-purple-500/10 border-purple-500/20 text-purple-400",
	},
};
/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export const HeroSection = ({
	data,
	locale,
	socialLinks,
}: {
	data: HeroData | null;
	locale: Locale;
	socialLinks: SocialLinks[] | null;
}) => {
	const t = useTranslations("Hero");
	const isRtl = locale === "ar";

	if (!data) return null;
	const { content, availability, primaryImage } = data;
	const theme = STATUS_THEMES[availability] || STATUS_THEMES.AVAILABLE;
	return (
		<MotionSection
			as='section'
			id='hero'
			dir={isRtl ? "rtl" : "ltr"}
			className='relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 py-24 overflow-hidden'>
			{/* --- RIPPLE BACKGROUND --- */}
			<div className='absolute -z-10 inset-0 opacity-70 dark:opacity-50 pointer-events-none'>
				<BackgroundRippleEffect rows={12} cols={44} cellSize={60} />
			</div>
			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='flex-1 space-y-6 text-center lg:text-start order-2 lg:order-1 z-10'>
				{/* Status Pill */}
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
					<span className='text-[10px] font-bold uppercase tracking-[0.2em]'>
						{t(`status.${data.availability}`)}
					</span>
				</motion.div>

				{/* Main Heading: Scaled for Mobile Fold */}
				<motion.h1
					variants={itemVariants}
					className='text-4xl md:text-5xl lg:text-6xl  font-black tracking-tight leading-[1.1]'>
					{content.greeting} <br />
					<span className='bg-linear-to-r capitalize from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent'>
						{content.name}
					</span>
				</motion.h1>

				{/* Staggered Role Text */}
				<motion.div
					variants={itemVariants}
					className='flex justify-center lg:justify-start'>
					<ModernStaggerFlip
						words={content.role.split("&&").map((w) => w.trim())}
						duration={3500}
						label={<Sparkles size={16} className='text-indigo-400' />}
					/>
				</motion.div>

				{/* Description: Controlled Width for readability */}
				<motion.p
					variants={itemVariants}
					className='max-w-md mx-auto lg:mx-0 text-sm md:text-base text-muted-foreground leading-relaxed'>
					{content.description}
				</motion.p>

				{/* CTA Group */}
				<motion.div
					variants={itemVariants}
					className='flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2'>
					<Button className='h-12 px-8 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 transition-all group shadow-lg shadow-indigo-500/20'>
						{content.ctaText}
						<ArrowRight
							className={cn(
								"ms-2 h-4 w-4 transition-transform group-hover:translate-x-1",
								isRtl && "rotate-180",
							)}
						/>
					</Button>

					<Button
						variant='outline'
						asChild
						className='h-12 px-8 rounded-xl font-bold border-zinc-200 dark:border-zinc-800'>
						<a href={content.resumeUrl ?? "#"} target='_blank'>
							<Download size={16} className='me-2 opacity-60' />
							{t("cv_button")}
						</a>
					</Button>
				</motion.div>

				{/* Social Integration */}
				<motion.div
					variants={itemVariants}
					className='flex items-center justify-center lg:justify-start gap-5 pt-4'>
					<div className='flex items-center gap-4'>
						{socialLinks?.map((social) => (
							<Link
								key={social.id}
								href={social.url}
								target='_blank'
								className='text-zinc-400 hover:text-indigo-500 transition-all transform hover:-translate-y-1'>
								{ICON_MAP[social.name.toLowerCase()] ?? ICON_MAP.default}
							</Link>
						))}
					</div>
					<span className='h-3 w-px bg-border' />
					<Link
						href='#contact'
						className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors'>
						<Mail size={16} />
						{t("talk_button")}
					</Link>
				</motion.div>
			</motion.div>

			{/* 2. RIGHT CONTENT: 3D Hover Image */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className='relative order-1 lg:order-2 flex justify-center items-center'>
				{/* Background Glow */}
				<div className='absolute -inset-10 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse pointer-events-none' />

				{/* Image Container with 3D Interaction */}
				<div className='relative w-72 h-80 sm:w-80 sm:h-96 lg:w-95 lg:h-120'>
					<HeroImageHover
						src={primaryImage || "/profile.png"}
						alt={content.name}
					/>

					{/* Floating Info Badge */}
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 1, duration: 0.6 }}
						className='absolute bottom-6 -left-6 hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-2xl'>
						<div className='h-2 w-2 rounded-full bg-emerald-500' />
						<span className='text-[10px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200'>
							Sana&apos;a, Yemen
						</span>
					</motion.div>
				</div>
			</motion.div>
		</MotionSection>
	);
};
/** @format */

/** @format */

import { useTransform } from "framer-motion";
import { BackgroundRippleEffect } from "../background-ripple-effect";

const ROTATION_STIFFNESS = 150;
const ROTATION_DAMPING = 20;

const HeroImageHover = ({ src, alt }: { src: string; alt: string }) => {
	const rotateX = useSpring(useMotionValue(0), {
		stiffness: ROTATION_STIFFNESS,
		damping: ROTATION_DAMPING,
	});
	const rotateY = useSpring(useMotionValue(0), {
		stiffness: ROTATION_STIFFNESS,
		damping: ROTATION_DAMPING,
	});

	// Parallax values based on rotation
	const imageX = useTransform(rotateY, [-15, 15], [15, -15]);
	const imageY = useTransform(rotateX, [-15, 15], [-15, 15]);

	function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		rotateX.set(y * -20); // Sensitivity
		rotateY.set(x * 20);
	}

	const handleMouseLeave = () => {
		rotateX.set(0);
		rotateY.set(0);
	};

	return (
		<motion.div
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			// 1. FLOATING ANIMATION (The "up and down" constant motion)
			animate={{ y: [0, -12, 0] }}
			transition={{
				duration: 5,
				repeat: Infinity,
				ease: "easeInOut",
			}}
			style={{
				rotateX,
				rotateY,
				transformStyle: "preserve-3d",
				perspective: "1200px",
			}}
			whileHover={{ scale: 1.02 }}
			className='group relative w-full h-full rounded-[2.5rem] lg:rounded-[4.5rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50'>
			{/* 2. PARALLAX IMAGE CONTAINER */}
			<motion.div
				className='relative w-full h-full scale-110'
				style={{
					x: imageX,
					y: imageY,
					translateZ: "60px", // Increased depth perception
				}}>
				<Image
					src={src}
					alt={alt}
					fill
					priority
					className='object-cover pointer-events-none'
				/>

				{/* 3. SENIOR OVERLAY: Softens the image edges inside the container */}
				<div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none' />
			</motion.div>

			{/* 4. REFLECTION/GLARE EFFECT */}
			<motion.div
				className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700'
				style={{
					background:
						"linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
					backgroundSize: "200% 200%",
				}}
				animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
				transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
			/>
		</motion.div>
	);
};
