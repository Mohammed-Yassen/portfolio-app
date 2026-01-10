/** @format */
"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { MotionSection } from "@/components/shared/motion-viewport";
import { Testimonial } from "@/server/data/testimonial";

// --- Types ---
interface TestimonialsSectionProps {
	data: Testimonial[];
	locale: string;
}

// --- Sub-Component: AnimatedTestimonials ---
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
			// Create a unique but consistent number from the ID string
			const hash = t.id
				.split("")
				.reduce((acc, char) => acc + char.charCodeAt(0), 0);
			return (hash % 21) - 10; // Results in a stable number between -10 and 10
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
			const interval = setInterval(handleNext, 5000);
			return () => clearInterval(interval);
		}
	}, [autoplay, handleNext, testimonials.length]);

	const activeItem = testimonials[active];

	return (
		<div className='mx-auto max-w-sm antialiased md:max-w-4xl px-4 py-20'>
			<div className='relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20'>
				{/* Image Stack */}
				<div className='relative h-80 w-full'>
					<AnimatePresence mode='popLayout'>
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={testimonial.id}
								initial={{
									opacity: 0,
									scale: 0.9,
									rotate: rotations[index],
								}}
								animate={{
									opacity: index === active ? 1 : 0.7,
									scale: index === active ? 1 : 0.95,
									zIndex: index === active ? 50 : testimonials.length - index,
									rotate: index === active ? 0 : rotations[index],
									y: index === active ? [0, -40, 0] : 0, // Add a subtle bounce for the active card
								}}
								exit={{ opacity: 0, scale: 0.9, rotate: rotations[index] }}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className='absolute inset-0'>
								<Image
									src={testimonial.avatarUrl || "/placeholder-avatar.jpg"}
									alt={testimonial.clientName}
									fill
									className='rounded-3xl border border-white/10 object-cover shadow-2xl'
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* Content Side */}
				<div className='flex flex-col justify-between py-4'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={active}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{ duration: 0.2 }}>
							<h3 className='text-2xl font-bold text-foreground'>
								{activeItem.clientName}
							</h3>
							<p className='text-sm text-muted-foreground'>
								{activeItem.clientTitle || activeItem.role}
							</p>

							<motion.div className='mt-8 text-lg leading-relaxed text-muted-foreground'>
								{activeItem.content.split(" ").map((word, index) => (
									<motion.span
										key={`${active}-${index}`}
										initial={{ filter: "blur(8px)", opacity: 0, y: 5 }}
										animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
										transition={{ duration: 0.2, delay: 0.01 * index }}
										className='inline-block'>
										{word}&nbsp;
									</motion.span>
								))}
							</motion.div>
						</motion.div>
					</AnimatePresence>

					{/* Navigation Buttons */}
					<div className='flex gap-4 pt-12 md:pt-0'>
						<button
							onClick={handlePrev}
							className='group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-all hover:bg-primary'
							aria-label='Previous testimonial'>
							{isRtl ? (
								<ArrowRight className='h-5 w-5 group-hover:text-primary-foreground' />
							) : (
								<ArrowLeft className='h-5 w-5 group-hover:text-primary-foreground' />
							)}
						</button>
						<button
							onClick={handleNext}
							className='group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-all hover:bg-primary'
							aria-label='Next testimonial'>
							{isRtl ? (
								<ArrowLeft className='h-5 w-5 group-hover:text-primary-foreground' />
							) : (
								<ArrowRight className='h-5 w-5 group-hover:text-primary-foreground' />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// --- Main Export ---
export const TestimonialsSection = ({
	data,
	locale,
}: TestimonialsSectionProps) => {
	const t = useTranslations("Testimonials");
	const isRtl = locale === "ar";

	return (
		<section
			id='testimonials'
			className='relative overflow-hidden bg-background py-24'
			dir={isRtl ? "rtl" : "ltr"}>
			<div className='container mx-auto max-w-6xl px-6'>
				<div className='mb-12 text-center'>
					<MotionSection preset='scaleUp'>
						<h2 className='mb-4 text-4xl font-bold tracking-tighter md:text-5xl'>
							{t.rich("title", {
								span: (chunks) => (
									<span className='text-primary'>{chunks}</span>
								),
							})}
						</h2>
						<p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
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
		<div className='mt-20 flex flex-col items-center gap-6 border-t py-12'>
			<div className='space-y-2 text-center'>
				<h3 className='text-2xl font-bold'>{t("question")}</h3>
				<p className='text-muted-foreground'>{t("subtext")}</p>
			</div>

			<Button
				asChild
				size='lg'
				className='group h-12 gap-2 rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40'>
				<Link href='/testimonials/new'>
					<MessageSquarePlus className='h-4 w-4' />
					{t("buttonText")}
					<ArrowRight
						className={`h-4 w-4 opacity-50 transition-transform ${
							isRtl
								? "rotate-180 group-hover:-translate-x-1"
								: "group-hover:translate-x-1"
						}`}
					/>
				</Link>
			</Button>
		</div>
	);
}
