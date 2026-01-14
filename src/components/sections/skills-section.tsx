/** @format */
"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Locale } from "@prisma/client";
import { TransformedSkillCategory } from "@/types";
import { MotionSection } from "../shared/motion-viewport";
import { cn } from "@/lib/utils";
import { resolveIcon } from "@/lib/icon-utils";
import { useTranslations } from "next-intl";

interface Props {
	initialData: TransformedSkillCategory[];
	locale: Locale;
}

// Logic: Dynamic Color Mapping based on mastery
const getSkillTheme = (level: number) => {
	if (level >= 90)
		return "from-emerald-400 to-cyan-500 shadow-emerald-500/20 text-emerald-500 dark:text-emerald-400";
	if (level >= 75)
		return "from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-600 dark:text-blue-400";
	if (level >= 50)
		return "from-amber-400 to-orange-500 shadow-amber-500/20 text-amber-600 dark:text-amber-400";
	return "from-zinc-400 to-zinc-600 shadow-zinc-500/10 text-zinc-500 dark:text-zinc-400";
};

export const SkillsSection = ({ initialData, locale }: Props) => {
	const t = useTranslations("SkillsSection");
	const isAr = locale === "ar";

	return (
		<section
			id='skills'
			className='relative overflow-hidden py-24 selection:bg-primary/30 bg-background transition-colors duration-500'>
			{/* Grid Pattern - Adaptive Opacity */}
			<div className='absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]' />

			<div className='container relative z-10 mx-auto px-6'>
				<MotionSection
					preset='fadeInUp'
					className='mb-20 flex flex-col items-center text-center'>
					<div className='mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5'>
						<span className='relative flex h-2 w-2'>
							<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75'></span>
							<span className='relative inline-flex h-2 w-2 rounded-full bg-primary'></span>
						</span>
						<span className='text-[11px] font-bold uppercase tracking-widest text-primary'>
							{t("badge")}
						</span>
					</div>

					<h2 className='text-4xl font-extrabold tracking-tight md:text-5xl uppercase text-foreground'>
						{t("titleStart")}{" "}
						<span className='bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent italic'>
							{t("titleEnd")}
						</span>
					</h2>
					<p className='mt-4 max-w-2xl text-muted-foreground'>
						{t("description")}
					</p>
				</MotionSection>

				<div
					className={cn(
						"grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 items-stretch",
						isAr ? "rtl" : "ltr",
					)}>
					{initialData.map((category, index) => (
						<SkillCategoryCard
							key={category.id}
							category={category}
							index={index}
							locale={locale}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

const SkillCategoryCard = ({
	category,
	index,
	locale,
}: {
	category: TransformedSkillCategory;
	index: number;
	locale: Locale;
}) => {
	const t = useTranslations("SkillsSection");
	const isAr = locale === "ar";
	const cardRef = useRef<HTMLDivElement>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const IconComponent = resolveIcon(category.icon);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	return (
		<motion.div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className='group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 p-1 transition-all hover:border-primary/30 shadow-sm dark:shadow-none'>
			{/* Spotlight Overlay */}
			<div
				className='pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100'
				style={{
					background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary-rgb, 59, 130, 246), 0.1), transparent 80%)`,
				}}
			/>

			<div className='relative flex h-full flex-col rounded-[2.3rem] bg-white/80 dark:bg-zinc-950/60 p-8 backdrop-blur-xl'>
				<div className='mb-6 flex items-center gap-4'>
					<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-primary shadow-sm group-hover:border-primary/40 transition-colors duration-500'>
						{IconComponent && <IconComponent size={28} strokeWidth={1.5} />}
					</div>
					<div className='min-w-0'>
						<h3 className='truncate text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
							{category.title}
						</h3>
						<p className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
							{category.skills.length} {t("techCount")}
						</p>
					</div>
				</div>

				<div className='flex grow flex-col justify-start space-y-4'>
					{category.skills.map((skill, sIdx) => {
						const themeClasses = getSkillTheme(skill.level || 0);

						return (
							<div key={skill.id} className='group/skill w-full'>
								<div className='mb-2 flex justify-between items-end'>
									<span className='text-sm font-medium text-foreground/80 group-hover/skill:text-primary transition-colors'>
										{skill.name}
									</span>
									<span
										className={cn(
											"font-mono text-[10px] font-bold tabular-nums",
											themeClasses.split(" ")[2],
										)}>
										{skill.level}%
									</span>
								</div>

								<div className='relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-800/50 overflow-hidden'>
									<motion.div
										initial={{ width: 0 }}
										whileInView={{ width: `${skill.level}%` }}
										transition={{
											duration: 1.5,
											ease: [0.34, 1.56, 0.64, 1],
											delay: 0.2 + sIdx * 0.1,
										}}
										viewport={{ once: true }}
										className={cn(
											"h-full rounded-full bg-gradient-to-r",
											themeClasses,
										)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
};
