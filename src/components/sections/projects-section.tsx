/** @format */
"use client";

import Link from "next/link";
import { FolderCode, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "../project-card";
import { TransformedProject } from "@/types/project-types";
import { Locale } from "@prisma/client";

interface Props {
	projectsData: TransformedProject[];
	locale: Locale;
}

export const ProjectsSection = ({ projectsData, locale }: Props) => {
	const isAr = locale === "ar";
	const dir = isAr ? "rtl" : "ltr";

	const content = {
		en: {
			title: "Featured",
			subtitle: "Projects",
			desc: "A collection of systems bridging the gap between theoretical research and scalable engineering.",
			total: "Projects Total",
			viewAll: "View All Projects",
		},
		ar: {
			title: "المشاريع",
			subtitle: "المختارة",
			desc: "مجموعة من الأنظمة التي تجسر الفجوة بين البحث النظري والهندسة القابلة للتطوير.",
			total: "إجمالي المشاريع",
			viewAll: "عرض جميع المشاريع",
		},
	}[locale];

	const featuredProjects = projectsData?.slice(0, 3);

	return (
		<section
			id='projects'
			dir={dir}
			className='py-24 bg-background relative overflow-hidden'>
			<div className='container mx-auto px-6 md:px-12'>
				<div
					className={`flex flex-col md:flex-row justify-between items-center mb-16 gap-6`}>
					<div className={`space-y-3 ${isAr ? "text-right" : "text-left"}`}>
						<h2 className='text-4xl font-bold tracking-tight'>
							{content.title}{" "}
							<span className='text-primary'>{content.subtitle}</span>
						</h2>
						<p className='text-muted-foreground max-w-xl text-lg'>
							{content.desc}
						</p>
					</div>
					<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border'>
						<FolderCode className='w-4 h-4 text-primary' />
						<span>
							{projectsData?.length || 0} {content.total}
						</span>
					</div>
				</div>

				<div className='flex flex-wrap justify-center gap-8'>
					{featuredProjects?.map((project) => (
						<div
							key={project.id}
							className='w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm'>
							<ProjectCard projectsData={project} locale={locale} />
						</div>
					))}
				</div>

				<div className='mt-16 flex flex-col items-center gap-4'>
					<Button
						asChild
						size='lg'
						className='group rounded-full px-12 border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300'>
						<Link href={`/${locale}/projects`}>
							{content.viewAll}
							<Zap
								className={`${
									isAr ? "mr-2" : "ml-2"
								} h-4 w-4 group-hover:scale-125 transition-transform`}
							/>
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};
