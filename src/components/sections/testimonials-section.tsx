/** @format */
"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MessageSquarePlus, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/shared/motion-viewport";
import { Testimonial } from "@/server/data/testimonial";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
	data: Testimonial[];
	locale: string;
}

export const AnimatedTestimonials = ({
	testimonials,
	autoplay = false,
	isRtl = false,
}: {
	testimonials: Testimonial[];
	autoplay?: boolean;
	isRtl?: boolean;
}) => {
	const [active, setActive] = useState(0);

	const rotations = useMemo(() => {
		return testimonials.map((t) => {
			const hash = t.id
				.split("")
				.reduce((acc, char) => acc + char.charCodeAt(0), 0);
			return (hash % 12) - 6;
		});
	}, [testimonials]);

	const handleNext = useCallback(() => {
		setActive((prev) => (prev + 1) % testimonials.length);
	}, [testimonials.length]);

	const handlePrev = useCallback(() => {
		setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	}, [testimonials.length]);

	useEffect(() => {
		if (autoplay && testimonials.length > 1) {
			const interval = setInterval(handleNext, 8000);
			return () => clearInterval(interval);
		}
	}, [autoplay, handleNext, testimonials.length]);

	const activeItem = testimonials[active];

	return (
		<div className='relative mx-auto max-w-6xl px-4 py-12'>
			{/* Background Aesthetic - Adjusted opacity for light mode */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] -z-10 overflow-hidden pointer-events-none'>
				<div className='absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full animate-pulse' />
				<div className='absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full animate-pulse' />
			</div>

			<div className='relative grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center'>
				{/* --- IMAGE STACK --- */}
				<div className='relative h-88.5 w-88.5 perspective-1000'>
					<AnimatePresence mode='popLayout'>
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={testimonial.id}
								initial={{ opacity: 0, scale: 0.9, rotateY: isRtl ? 20 : -20 }}
								animate={{
									opacity:
										index === active
											? 1
											: index === (active + 1) % testimonials.length
											? 0.4
											: 0,
									scale: index === active ? 1 : 0.9,
									zIndex: index === active ? 40 : 30 - index,
									rotateY: index === active ? 0 : isRtl ? 15 : -15,
									x: index === active ? 0 : isRtl ? -40 : 40,
								}}
								exit={{ opacity: 0, scale: 0.8, x: isRtl ? 100 : -100 }}
								transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
								className='absolute inset-0'>
								<div className='group relative h-full w-full overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl dark:shadow-2xl transition-transform duration-500 hover:scale-[1.02]'>
									<Image
										src={testimonial.avatarUrl || "/placeholder-avatar.jpg"}
										alt={testimonial.clientName}
										fill
										className='object-cover transition-transform duration-700 group-hover:scale-110'
									/>
									{/* Gradient Overlay */}
									<div className='absolute inset-0 bg-gradient-to-t from-black/60 dark:from-black/80 via-transparent to-transparent' />

									{/* Quote Icon Badge */}
									<div className='absolute bottom-8 right-8 size-14 rounded-2xl bg-indigo-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-xl'>
										<Quote size={24} fill='currentColor' />
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* --- CONTENT SIDE --- */}
				<div className='flex flex-col justify-center space-y-10'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={active}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.5 }}
							className='space-y-6'>
							<div className='space-y-2'>
								<motion.h3 className='text-3xl md:text-4xl font-black tracking-tighter text-foreground'>
									{activeItem.clientName}
								</motion.h3>
								<div className='flex items-center gap-3'>
									<span className='h-px w-6 bg-indigo-500' />
									<p className='text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'>
										{activeItem.clientTitle || activeItem.role}
									</p>
								</div>
							</div>

							<motion.div className='relative'>
								{/* Adaptive Quote background */}
								<span className='absolute -top-10 -left-6 text-9xl font-serif text-black/[0.03] dark:text-white/[0.03] select-none'>
									“
								</span>

								<div className='text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium italic'>
									{activeItem.content.split(" ").map((word, index) => (
										<motion.span
											key={`${active}-${index}`}
											initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
											animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
											transition={{ duration: 0.3, delay: 0.02 * index }}
											className='inline-block'>
											{word}&nbsp;
										</motion.span>
									))}
								</div>
							</motion.div>
						</motion.div>
					</AnimatePresence>

					{/* --- NAVIGATION --- */}
					<div className='flex items-center gap-8 pt-6 border-t border-black/5 dark:border-white/5'>
						<div className='flex gap-3'>
							<NavButton onClick={handlePrev} isRtl={isRtl} direction='left' />
							<NavButton onClick={handleNext} isRtl={isRtl} direction='right' />
						</div>

						{/* Progress Indicator */}
						<div className='flex gap-1'>
							{testimonials.map((_, i) => (
								<div
									key={i}
									className={cn(
										"h-1 transition-all duration-500 rounded-full",
										i === active
											? "w-8 bg-indigo-500"
											: "w-2 bg-zinc-200 dark:bg-zinc-800",
									)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NavButton = ({
	onClick,
	isRtl,
	direction,
}: {
	onClick: () => void;
	isRtl: boolean;
	direction: "left" | "right";
}) => (
	<button
		onClick={onClick}
		className='group flex h-14 w-14 items-center justify-center rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900/50 shadow-sm backdrop-blur-sm transition-all hover:bg-indigo-500 dark:hover:bg-indigo-500/50 hover:border-indigo-500'>
		{direction === "left" ? (
			<ArrowLeft
				className={cn(
					"h-6 w-6 text-zinc-500 dark:text-zinc-400 group-hover:text-white transition-colors",
					isRtl && "rotate-180",
				)}
			/>
		) : (
			<ArrowRight
				className={cn(
					"h-6 w-6 text-zinc-500 dark:text-zinc-400 group-hover:text-white transition-colors",
					isRtl && "rotate-180",
				)}
			/>
		)}
	</button>
);

export const TestimonialsSection = ({
	data,
	locale,
}: TestimonialsSectionProps) => {
	const t = useTranslations("Testimonials");
	const isRtl = locale === "ar";

	return (
		<section
			id='testimonials'
			className='relative py-32 overflow-hidden bg-background'
			dir={isRtl ? "rtl" : "ltr"}>
			<div className='container relative z-10 mx-auto px-6'>
				<div className='mb-20 space-y-4'>
					<MotionSection preset='fadeInUp' className='max-w-3xl'>
						<h2 className='text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-foreground'>
							{t.rich("title", {
								span: (chunks) => (
									<span className='text-zinc-400 dark:text-zinc-500 italic font-serif font-light'>
										{chunks}
									</span>
								),
							})}
						</h2>
						<p className='text-lg md:text-xl text-muted-foreground border-l-2 border-indigo-500/20 pl-6'>
							{t("description")}
						</p>
					</MotionSection>
				</div>

				{data.length > 0 && (
					<AnimatedTestimonials
						testimonials={data}
						autoplay={true}
						isRtl={isRtl}
					/>
				)}

				<TestimonialCTA locale={locale} />
			</div>
		</section>
	);
};

export function TestimonialCTA({ locale }: { locale: string }) {
	const t = useTranslations("Testimonials.cta");
	const isRtl = locale === "ar";

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			className='mt-16 rounded-[3rem] border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 p-12 text-center'>
			<div className='max-w-xl mx-auto space-y-8'>
				<div className='space-y-2'>
					<h3 className='text-3xl font-bold tracking-tight text-foreground'>
						{t("question")}
					</h3>
					<p className='text-muted-foreground'>{t("subtext")}</p>
				</div>

				<Button
					asChild
					size='lg'
					className='h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg'>
					<Link href='/testimonials/new' className='flex items-center gap-3'>
						<MessageSquarePlus className='h-5 w-5' />
						{t("buttonText")}
						<ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
					</Link>
				</Button>
			</div>
		</motion.div>
	);
}
