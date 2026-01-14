/** @format */
"use client";

import Link from "next/link";
import { FolderCode, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "../project-card";
import { TransformedProject } from "@/types/project-types";
import { Locale } from "@prisma/client";
import { MotionSection } from "../shared/motion-viewport";

interface Props {
	projectsData: TransformedProject[];
	locale: Locale;
}

export const ProjectsSection = ({ projectsData, locale }: Props) => {
	const t = useTranslations("ProjectsSection");
	const isAr = locale === "ar";
	const featuredProjects = projectsData?.slice(0, 3) || [];

	return (
		<section id='projects' className='relative py-24 overflow-hidden'>
			{/* Background Glow */}
			<div className='absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-primary/5 blur-[120px]' />

			<div className='container mx-auto px-6 relative z-10'>
				<div className='flex flex-col md:flex-row justify-between items-center mb-16 gap-8'>
					<MotionSection preset='fadeInRight' className='max-w-2xl'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='h-px w-8 bg-primary/50' />
							<span className='text-sm font-bold tracking-widest uppercase text-primary/80'>
								{isAr ? "معرض الأعمال" : "Portfolio"}
							</span>
						</div>

						<h2 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-6'>
							{t("titleStart")}{" "}
							<span className='bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent italic'>
								{t("titleEnd")}
							</span>
						</h2>

						<p className='text-muted-foreground text-lg leading-relaxed'>
							{t("description")}
						</p>
					</MotionSection>

					<MotionSection preset='fadeInUp' className='shrink'>
						<div className='group flex items-center gap-3 bg-zinc-900/50 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-white/5 transition-all hover:border-primary/30'>
							<div className='p-2 rounded-lg bg-primary/10 text-primary'>
								<FolderCode className='w-5 h-5' />
							</div>
							<div className='flex flex-col'>
								<span className='text-[10px] uppercase tracking-tighter text-zinc-500 font-bold'>
									{t("totalProjects")}
								</span>
								<span className='text-lg font-mono font-bold leading-none'>
									{projectsData?.length || 0}
								</span>
							</div>
						</div>
					</MotionSection>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch'>
					{featuredProjects.map((project, index) => (
						<motion.div
							key={project.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.5 }}
							className='flex h-full'>
							<ProjectCard projectsData={project} locale={locale} />
						</motion.div>
					))}
				</div>

				<MotionSection
					preset='fadeInUp'
					className='mt-20 flex flex-col items-center'>
					<Button
						asChild
						variant='outline'
						size='lg'
						className='group relative h-14 rounded-full px-10 border-white/10 bg-zinc-900/50 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-xl'>
						<Link
							href={`/${locale}/projects`}
							className='flex items-center gap-3'>
							<span className='font-bold tracking-wide uppercase text-sm'>
								{t("viewAll")}
							</span>
							<Zap className='h-4 w-4 fill-current group-hover:scale-125 transition-transform' />
							{isAr ? (
								<ArrowLeft className='h-4 w-4' />
							) : (
								<ArrowRight className='h-4 w-4' />
							)}
						</Link>
					</Button>
					<p className='mt-6 text-xs font-medium text-zinc-500 uppercase tracking-widest'>
						{t("footerText")}
					</p>
				</MotionSection>
			</div>
		</section>
	);
};
