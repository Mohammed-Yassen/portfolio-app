/** @format */
"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
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
		<div className='relative mx-auto max-w-6xl px-4 py-8 md:py-12'>
			{/* Background Aesthetic */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-50 dark:opacity-100'>
				<div className='absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse' />
				<div className='absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/20 blur-[100px] rounded-full animate-pulse' />
			</div>

			<div className='relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center'>
				{/* --- IMAGE STACK (Responsive) --- */}
				<div className='relative aspect-square w-full max-w-[320px] md:max-w-[450px] mx-auto lg:mx-0 perspective-1000'>
					<AnimatePresence mode='popLayout'>
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={testimonial.id}
								initial={{ opacity: 0, scale: 0.9, rotateY: isRtl ? 15 : -15 }}
								animate={{
									opacity: index === active ? 1 : 0,
									scale: index === active ? 1 : 0.9,
									zIndex: index === active ? 40 : 0,
									rotateY: index === active ? 0 : isRtl ? 10 : -10,
									x: index === active ? 0 : isRtl ? -30 : 30,
								}}
								exit={{ opacity: 0, scale: 0.8, x: isRtl ? 60 : -60 }}
								transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
								className='absolute inset-0'>
								<div className='relative h-full w-full overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl'>
									<Image
										src={testimonial.avatarUrl || "/placeholder-avatar.jpg"}
										alt={testimonial.clientName}
										fill
										sizes='(max-width: 768px) 100vw, 50vw'
										className='object-cover transition-transform duration-700 hover:scale-105'
										priority={index === active}
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/60 dark:from-black/80 via-transparent to-transparent' />

									{/* Quote Icon Badge */}
									<div className='absolute bottom-6 right-6 md:bottom-10 md:right-10 size-12 md:size-16 rounded-2xl bg-indigo-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-xl'>
										<Quote
											size={24}
											className='md:w-8 md:h-8'
											fill='currentColor'
										/>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* --- CONTENT SIDE --- */}
				<div className='flex flex-col justify-center space-y-8 text-center lg:text-left'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={active}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.4 }}
							className='space-y-6'>
							<div className='space-y-2'>
								<h3 className='text-3xl md:text-5xl font-black tracking-tighter text-foreground'>
									{activeItem.clientName}
								</h3>
								<div
									className={cn(
										"flex items-center gap-3 justify-center lg:justify-start",
										isRtl && "lg:justify-end",
									)}>
									<span className='h-px w-6 bg-indigo-500 hidden md:block' />
									<p className='text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'>
										{activeItem.clientTitle || activeItem.role}
									</p>
								</div>
							</div>

							<div className='relative'>
								<span className='absolute -top-10 -left-6 text-9xl font-serif text-indigo-500/[0.05] dark:text-white/[0.03] select-none hidden md:block'>
									“
								</span>
								<div className='text-lg md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium italic'>
									{activeItem.content}
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* --- NAVIGATION --- */}
					<div className='flex flex-col md:flex-row items-center gap-6 justify-center lg:justify-start pt-6 border-t border-black/5 dark:border-white/5'>
						<div className='flex gap-4'>
							<NavButton onClick={handlePrev} isRtl={isRtl} direction='left' />
							<NavButton onClick={handleNext} isRtl={isRtl} direction='right' />
						</div>

						{/* Progress Indicator Dots */}
						<div className='flex gap-2'>
							{testimonials.map((_, i) => (
								<button
									key={i}
									onClick={() => setActive(i)}
									className={cn(
										"h-1.5 transition-all duration-300 rounded-full",
										i === active
											? "w-8 bg-indigo-500"
											: "w-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700",
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
		className='group flex h-14 w-14 items-center justify-center rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-md transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-110 active:scale-95'>
		{direction === "left" ? (
			<ArrowLeft
				className={cn(
					"h-6 w-6 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors",
					isRtl && "rotate-180",
				)}
			/>
		) : (
			<ArrowRight
				className={cn(
					"h-6 w-6 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors",
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
			className='relative py-24 md:py-32 overflow-hidden bg-background'
			dir={isRtl ? "rtl" : "ltr"}>
			<div className='container relative z-10 mx-auto px-6'>
				<MotionSection preset='fadeInUp' className='max-w-3xl mb-16 md:mb-20'>
					<h2 className='text-4xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-foreground'>
						{t.rich("title", {
							span: (chunks) => (
								<span className='text-muted-foreground italic font-serif font-light'>
									{chunks}
								</span>
							),
						})}
					</h2>
					<p className='text-lg md:text-xl text-muted-foreground border-l-4 border-indigo-500/40 pl-6'>
						{t("description")}
					</p>
				</MotionSection>

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
			viewport={{ once: true }}
			className='mt-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-16 text-center'>
			<div className='max-w-xl mx-auto space-y-8'>
				<div className='space-y-3'>
					<h3 className='text-3xl font-black tracking-tight text-foreground'>
						{t("question")}
					</h3>
					<p className='text-muted-foreground text-lg'>{t("subtext")}</p>
				</div>

				<Button
					asChild
					size='lg'
					className='h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-500/20'>
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
