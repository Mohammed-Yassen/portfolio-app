/** @format */
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { Locale } from "@prisma/client";
import { TransformedEducation, TransformedExperience } from "@/types";
import { cn } from "@/lib/utils";
import { MotionSection } from "../shared/motion-viewport";

interface Props {
	expData: TransformedExperience[];
	eduData: TransformedEducation[];
	locale: Locale;
}

export const ExperienceSection = ({ expData, eduData, locale }: Props) => {
	const sectionRef = useRef<HTMLElement>(null);
	const isAr = locale === "ar";

	const formatDate = (dateString: string | null) => {
		if (!dateString) return isAr ? "الآن" : "Present";
		return new Date(dateString).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
			year: "numeric",
			month: "short",
		});
	};

	return (
		<MotionSection
			ref={sectionRef}
			id='experience'
			as='section'
			className='py-24  relative overflow-hidden'>
			{/* Decorative Glows */}
			<div className='absolute top-1/4 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none' />
			<div className='absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none' />

			<div
				className='container mx-auto px-6 max-w-6xl relative z-10'
				dir={isAr ? "rtl" : "ltr"}>
				<div className='grid md:grid-cols-2 gap-16 relative'>
					{/* EXPERIENCE COLUMN */}
					<div className='space-y-12'>
						<motion.h2
							initial={{ opacity: 0, y: -10 }}
							whileInView={{ opacity: 1, y: 0 }}
							className='text-3xl font-bold flex items-center gap-4 group'>
							<div className='p-2 rounded-xl bg-primary/10 text-primary group-hover:rotate-12 transition-transform'>
								<Briefcase size={28} />
							</div>
							{isAr ? "الخبرة العملية" : "Experience"}
						</motion.h2>

						<div
							className={cn(
								"relative border-muted space-y-12",
								isAr ? "border-r-2 mr-4" : "border-l-2 ml-4",
							)}>
							{expData.map((exp, i) => (
								<motion.div
									key={exp.id}
									initial={{ opacity: 0, x: isAr ? 20 : -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									className={cn("relative group", isAr ? "pr-10" : "pl-10")}>
									{/* Timeline Dot */}
									<div
										className={cn(
											"absolute w-5 h-5 bg-background border-2 border-primary rounded-full top-1 z-10 group-hover:bg-primary transition-colors duration-300",
											isAr ? "-right-[11px]" : "-left-[11px]",
										)}>
										<div className='w-full h-full rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-40' />
									</div>

									<div className='space-y-2 p-6 rounded-2xl border border-transparent hover:border-muted hover:bg-muted/30 transition-all duration-300'>
										<div className='flex items-center gap-2 text-primary text-sm font-semibold tracking-wider'>
											<Calendar size={14} />
											{formatDate(exp.startDate)} —{" "}
											{exp.isCurrent
												? isAr
													? "الآن"
													: "Present"
												: formatDate(exp.endDate)}
										</div>
										<h3 className='text-xl font-bold text-foreground'>
											{exp.role}
										</h3>
										<h4 className='text-lg font-medium text-muted-foreground'>
											{exp.companyName}
										</h4>
										{exp.description && (
											<p className='text-muted-foreground leading-relaxed pt-2 border-t border-muted/50'>
												{exp.description}
											</p>
										)}
									</div>
								</motion.div>
							))}
						</div>
					</div>

					{/* EDUCATION COLUMN */}
					<div className='space-y-12'>
						<motion.h2
							initial={{ opacity: 0, y: -10 }}
							whileInView={{ opacity: 1, y: 0 }}
							className='text-3xl font-bold flex items-center gap-4 group'>
							<div className='p-2 rounded-xl bg-primary/10 text-primary group-hover:rotate-12 transition-transform'>
								<GraduationCap size={28} />
							</div>
							{isAr ? "التعليم" : "Education"}
						</motion.h2>

						<div
							className={cn(
								"relative border-muted space-y-12",
								isAr ? "border-r-2 mr-4" : "border-l-2 ml-4",
							)}>
							{eduData.map((edu, i) => (
								<motion.div
									key={edu.id}
									initial={{ opacity: 0, x: isAr ? 20 : -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									className={cn("relative group", isAr ? "pr-10" : "pl-10")}>
									{/* Timeline Dot */}
									<div
										className={cn(
											"absolute w-5 h-5 bg-background border-2 border-primary rounded-full top-1 z-10 group-hover:bg-primary transition-colors duration-300",
											isAr ? "-right-[11px]" : "-left-[11px]",
										)}
									/>

									<div className='space-y-2 p-6 rounded-2xl border border-transparent hover:border-muted hover:bg-muted/30 transition-all duration-300'>
										<div className='flex items-center justify-between flex-wrap gap-2'>
											<div className='flex items-center gap-2 text-primary text-sm font-semibold tracking-wider'>
												<Calendar size={14} />
												{formatDate(edu.startDate)} —{" "}
												{edu.isCurrent
													? isAr
														? "الآن"
														: "Present"
													: formatDate(edu.endDate)}
											</div>
											<span className='text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full'>
												{edu.degree}
											</span>
										</div>
										<h3 className='text-xl font-bold text-foreground'>
											{edu.schoolName}
										</h3>
										<p className='text-sm italic text-muted-foreground/80'>
											{edu.fieldOfStudy}
										</p>
										{edu.description && (
											<p className='text-muted-foreground leading-relaxed pt-2 border-t border-muted/50'>
												{edu.description}
											</p>
										)}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</div>
		</MotionSection>
	);
};
