/** @format */
"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
	Github,
	ExternalLink,
	ArrowLeft,
	ArrowRight,
	Code2,
	LayoutDashboard,
	Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";
import { TransformedProject } from "@/types/project-types";
import { Locale } from "@prisma/client";
import { EditorContent } from "@/components/editor-content";

interface Props {
	project: TransformedProject;
	locale: Locale;
}

export function SingleProjectClient({ project, locale }: Props) {
	const isAr = locale === "ar";
	const dir = isAr ? "rtl" : "ltr";

	// UI Translations
	const content = {
		en: {
			back: "Back",
			featured: "Featured Work",
			docs: "Project Documentation",
			gallery: "Visual Gallery",
			hub: "Project Hub",
			live: "View Live Site",
			repo: "Source Repository",
			techs: "Technologies",
			completion: "Completion",
			role: "Role",
			roleName: "Lead Engineer",
			demo: `## The Challenge...`, // Add your full demo text here
		},
		ar: {
			back: "العودة",
			featured: "عمل مميز",
			docs: "توثيق المشروع",
			gallery: "المعرض المرئي",
			hub: "مركز المشروع",
			live: "زيارة الموقع",
			repo: "مستودع الكود",
			techs: "التقنيات المستخدمة",
			completion: "تاريخ الإنجاز",
			role: "الدور",
			roleName: "مهندس برمجيات رئيسي",
			demo: `## التحدي...`,
		},
	}[locale];

	return (
		<main dir={dir} className='min-h-screen bg-background pb-20'>
			{/* Hero Header */}
			<div className='relative h-[60vh] w-full overflow-hidden'>
				<Image
					src={project.mainImage}
					alt={project.title}
					fill
					className='object-cover'
					priority
				/>
				<div className='absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent' />

				<div className='container relative h-full flex flex-col justify-end pb-12 px-6'>
					<BackButton
						className='w-fit relative'
						title={content.back}
						icon={isAr ? ArrowRight : ArrowLeft}
						fallback={`/${locale}/projects`}
					/>

					<div className='flex items-center gap-3 mb-4 mt-6'>
						<Badge className='uppercase tracking-widest px-3 py-1'>
							{project.category.replace("_", " ")}
						</Badge>
						{project.isFeatured && (
							<Badge
								variant='outline'
								className='text-white border-white/20 backdrop-blur-md'>
								{content.featured}
							</Badge>
						)}
					</div>
					<h1
						className={`text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight max-w-4xl ${
							isAr ? "leading-tight" : ""
						}`}>
						{project.title}
					</h1>
				</div>
			</div>

			<div className='container px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16'>
				{/* Main Content (Left in LTR, Right in RTL) */}
				<div className='lg:col-span-2 space-y-16'>
					<section>
						<div
							className={`flex items-center gap-2 mb-6 text-primary ${
								isAr ? "flex-row-reverse" : ""
							}`}>
							<LayoutDashboard className='w-5 h-5' />
							<h2 className='text-sm font-bold uppercase tracking-wider'>
								{content.docs}
							</h2>
						</div>
						<article
							className={`prose prose-invert prose-primary max-w-none ${
								isAr ? "text-right" : "text-left"
							}`}>
							<div className='mt-10'>
								<EditorContent content={project.content} />
							</div>
							{/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
								{project.content || content.demo}
							</ReactMarkdown> */}
						</article>
					</section>

					{/* Gallery */}
					{project.gallery && project.gallery.length > 0 && (
						<section className='space-y-8'>
							<div
								className={`flex items-center gap-2 text-primary ${
									isAr ? "flex-row-reverse" : ""
								}`}>
								<ImageIcon className='w-5 h-5' />
								<h2 className='text-sm font-bold uppercase tracking-wider'>
									{content.gallery}
								</h2>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{project.gallery.map((img: string, idx: number) => (
									<div
										key={idx}
										className={`relative overflow-hidden rounded-3xl border bg-muted group ${
											idx === 0 ? "md:col-span-2 aspect-16/7" : "aspect-square"
										}`}>
										<Image
											src={img}
											alt={`Gallery item ${idx + 1}`}
											fill
											className='object-cover transition-transform duration-700 group-hover:scale-105'
										/>
									</div>
								))}
							</div>
						</section>
					)}
				</div>

				{/* Sidebar */}
				<aside className='space-y-8'>
					<div className='bg-card border rounded-4xl p-8 shadow-sm sticky top-24'>
						<h3
							className={`text-xl font-bold mb-8 flex items-center gap-3 ${
								isAr ? "flex-row-reverse" : ""
							}`}>
							<Code2 className='w-5 h-5 text-primary' /> {content.hub}
						</h3>

						<div className='flex flex-col gap-4'>
							{project.liveUrl && (
								<Button
									className='w-full h-12 rounded-2xl gap-2 font-bold'
									asChild>
									<a href={project.liveUrl} target='_blank' rel='noreferrer'>
										{content.live} <ExternalLink className='w-4 h-4' />
									</a>
								</Button>
							)}
							{project.repoUrl && (
								<Button
									variant='outline'
									className='w-full h-12 rounded-2xl gap-2 border-primary/20 hover:bg-primary/5'
									asChild>
									<a href={project.repoUrl} target='_blank' rel='noreferrer'>
										{content.repo} <Github className='w-4 h-4' />
									</a>
								</Button>
							)}
						</div>

						<div className='mt-10 pt-8 border-t space-y-8'>
							<div>
								<h4
									className={`text-[10px] uppercase font-black text-muted-foreground mb-4 tracking-[0.2em] ${
										isAr ? "text-right" : ""
									}`}>
									{content.techs}
								</h4>
								<div
									className={`flex flex-wrap gap-2 ${
										isAr ? "flex-row-reverse" : ""
									}`}>
									{project.techniques?.map((tech) => (
										<Badge
											key={tech.id}
											variant='secondary'
											className='rounded-lg px-3 py-1 bg-muted/50 text-xs font-medium border-none'>
											{tech.name}
										</Badge>
									))}
								</div>
							</div>

							<div className='flex justify-between items-end'>
								<div className={isAr ? "text-right" : ""}>
									<h4 className='text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-[0.2em]'>
										{content.completion}
									</h4>
									<p className='text-sm font-bold'>
										{new Date(project.updatedAt).toLocaleDateString(
											locale === "ar" ? "ar-EG" : "en-US",
											{
												month: "short",
												year: "numeric",
											},
										)}
									</p>
								</div>
								<div className={isAr ? "text-left" : "text-right"}>
									<h4 className='text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-[0.2em]'>
										{content.role}
									</h4>
									<p className='text-sm font-bold'>{content.roleName}</p>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</main>
	);
}
