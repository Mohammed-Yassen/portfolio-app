/** @format */
"use client";

import Image from "next/image";
import Link from "next/link";
import {
	ExternalLink,
	Github,
	ArrowRight,
	ArrowLeft,
	Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransformedProject } from "@/types/project-types";
import { Locale } from "@prisma/client";

interface Props {
	projectsData: TransformedProject;
	locale: Locale;
}

export const ProjectCard = ({ projectsData, locale }: Props) => {
	// 1. Determine direction
	const isAr = locale === "ar";
	const dir = isAr ? "rtl" : "ltr";

	// 2. Static Translations
	const dict = {
		en: {
			details: "Details",
			featured: "Featured",
			unknownTech: "Unnamed Technique",
		},
		ar: {
			details: "التفاصيل",
			featured: "مميز",
			unknownTech: "تقنية غير مسماة",
		},
	};

	const t = dict[locale as keyof typeof dict] || dict.en;

	return (
		<div
			dir={dir}
			className='group w-full relative bg-card border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full'>
			{/* Image Section */}
			<div className='relative h-56 w-full overflow-hidden'>
				<Image
					src={projectsData.mainImage}
					alt={projectsData.title}
					fill
					className='object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out grayscale-[20%] group-hover:grayscale-0'
				/>
				<div className='absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent' />

				{/* Tags - Positioned based on language */}
				<div
					className={`absolute bottom-4 ${
						isAr ? "right-4" : "left-4"
					} flex flex-wrap gap-2`}>
					{projectsData.tags?.map((tag) => (
						<Badge
							key={tag.id}
							variant='secondary'
							className='bg-background/80 backdrop-blur-sm border-none shadow-sm'>
							{tag.name}
						</Badge>
					))}
				</div>

				{/* Featured Badge */}
				{projectsData?.isFeatured && (
					<div className={`absolute top-4 ${isAr ? "left-4" : "right-4"}`}>
						<Badge className='bg-primary text-primary-foreground border-none px-3 py-1'>
							{t.featured}
						</Badge>
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className='p-6 space-y-4 grow flex flex-col'>
				<div className='flex items-center gap-2'>
					<Layers className='w-3 h-3 text-primary' />
					<span className='text-xs font-bold text-primary tracking-widest uppercase italic'>
						{projectsData.category.replace("_", " ")}
					</span>
				</div>

				<h3
					className={`text-xl font-bold group-hover:text-primary transition-colors ${
						isAr ? "font-arabic" : ""
					}`}>
					{projectsData.title}
				</h3>

				<p className='text-sm text-muted-foreground leading-relaxed grow line-clamp-3'>
					{projectsData.description}
				</p>

				{/* Techniques */}
				<div className='flex flex-wrap gap-1.5 py-2'>
					{projectsData.techniques?.map((tech) => (
						<span
							key={tech.id}
							className='text-[10px] px-2 py-0.5 rounded bg-muted font-medium'>
							{tech.name}
						</span>
					))}
				</div>

				{/* Footer Actions */}
				<div className='pt-4 flex items-center gap-3 border-t'>
					<Button
						variant='default'
						size='sm'
						className='flex-1 rounded-xl shadow-md'
						asChild>
						<Link href={`/${locale}/projects/${projectsData?.id}`}>
							<span>{t.details}</span>

							{isAr ? (
								<ArrowLeft className='w-4 h-4 ml-2' />
							) : (
								<ArrowRight className='w-4 h-4 mr-2' />
							)}
							{/* {t.details} */}
						</Link>
					</Button>

					{projectsData.liveUrl && (
						<Button
							variant='outline'
							size='icon'
							className='rounded-xl'
							asChild>
							<a
								href={projectsData.liveUrl}
								target='_blank'
								rel='noopener noreferrer'>
								<ExternalLink className='w-4 h-4' />
							</a>
						</Button>
					)}

					{projectsData.repoUrl && (
						<Button
							variant='outline'
							size='icon'
							className='rounded-xl'
							asChild>
							<a
								href={projectsData.repoUrl}
								target='_blank'
								rel='noopener noreferrer'>
								<Github className='w-4 h-4' />
							</a>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
