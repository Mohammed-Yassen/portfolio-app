/** @format */
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Locale } from "@prisma/client";
import { TransformedSkillCategory } from "@/types";
import { MotionSection } from "../shared/motion-viewport";
import { cn } from "@/lib/utils";
import { resolveIcon } from "@/lib/icon-utils";

interface Props {
	initialData: TransformedSkillCategory[];
	locale: Locale;
}

const getLevelGradient = (level: number) => {
	if (level >= 90) return "from-emerald-500 via-teal-400 to-cyan-400";
	if (level >= 75) return "from-blue-600 via-indigo-500 to-violet-500";
	if (level >= 50) return "from-amber-400 via-orange-500 to-rose-500";
	return "from-slate-400 to-slate-600";
};

// logic to handle centering and columns for same-height cards
const getGridConfig = (count: number) => {
	if (count === 1) return "max-w-2xl grid-cols-1";
	if (count === 2) return "max-w-5xl grid-cols-1 md:grid-cols-2";
	// Default for 3 or more: standard 3-column grid
	return "max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
};

export const SkillsSection = ({ initialData, locale }: Props) => {
	const isAr = locale === "ar";
	const gridConfig = getGridConfig(initialData.length);

	return (
		<section id='skills' className='py-24 relative overflow-hidden '>
			{/* Dynamic Background Decoration */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30'>
				<div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full' />
				<div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full' />
			</div>

			<div className='container mx-auto px-6 relative z-10'>
				<MotionSection preset='fadeInUp' className='mb-20 text-center'>
					<h2
						// dir={isAr ? "rtl" : "ltr"}
						className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>
						{isAr ? "الخبرات " : "Technical "}
						<span className='text-primary bg-clip-text bg-linear-to-r from-primary to-blue-600'>
							{isAr ? "التقنية" : "Expertise"}
						</span>
					</h2>
					<div className='h-1.5 w-24 bg-linear-to-r from-primary to-blue-600 mx-auto rounded-full mb-6' />
					<p className='max-w-2xl mx-auto text-muted-foreground text-lg'>
						{isAr
							? "نظرة شاملة على مهاراتي التقنية ومستويات الإتقان في مختلف مجالات تطوير البرمجيات."
							: "A comprehensive overview of my technical stack and proficiency levels in various domains of software development."}
					</p>
				</MotionSection>

				<div
					className={cn(
						"grid gap-6 mx-auto transition-all duration-500 ",
						gridConfig,
					)}
					dir={isAr ? "rtl" : "ltr"}>
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
	const isAr = locale === "ar";

	// THE FIX: Use useMemo to prevent "Cannot create components during render"
	const IconComponent = useMemo(
		() => resolveIcon(category.icon),
		[category.icon],
	);

	return (
		<MotionSection
			as='div'
			preset='scaleUp'
			delay={index * 0.1}
			variant='glass'
			className='break-inside-avoid h-fit p-1 rounded-3xl transition-all duration-500 group'>
			<div
				dir={isAr ? "rtl" : "ltr"}
				className='bg-card/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 rounded-[calc(1.5rem-1px)] border border-white/5 hover:border-primary/20 transition-colors h-full'>
				{/* Category Header */}
				<div className='flex items-center gap-4 mb-8'>
					<div className='relative shrink-0'>
						<div className='absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500' />
						<div className='relative p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner'>
							<IconComponent size={24} />
						</div>
					</div>
					<div className='min-w-0'>
						<h3 className='text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors truncate'>
							{category.title}
						</h3>
						<span className='text-[10px] uppercase tracking-widest text-muted-foreground font-semibold'>
							{category.skills.length} {isAr ? "تقنيات" : "Technologies"}
						</span>
					</div>
				</div>

				{/* Skills List */}
				<div className='space-y-6'>
					{category.skills.map((skill, sIdx) => {
						const level = skill?.level || 0;
						return (
							<div key={skill.id} className='relative'>
								<div className='flex justify-between items-end mb-2'>
									<span className='text-sm font-semibold text-foreground/80 flex items-center gap-2'>
										<div className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
										{skill.name}
									</span>
									{level > 0 && (
										<span className='text-xs font-mono text-muted-foreground'>
											{level}%
										</span>
									)}
								</div>

								<div className='h-2 w-full bg-muted/30 rounded-full overflow-hidden p-px border border-white/5'>
									<motion.div
										initial={{ width: 0 }}
										whileInView={{ width: `${level}%` }}
										viewport={{ once: true }}
										transition={{
											type: "spring",
											bounce: 0,
											duration: 1.5,
											delay: 0.1 + sIdx * 0.05,
										}}
										className={cn(
											"h-full rounded-full bg-linear-to-r shadow-sm",
											getLevelGradient(level),
										)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</MotionSection>
	);
};
