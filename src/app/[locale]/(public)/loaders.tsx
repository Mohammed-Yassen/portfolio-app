/** @format */
import { Locale } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import {
	getAboutData,
	getEducations,
	getExperiences,
	getHeroData,
	getSkills,
} from "@/server/data";
import { HeroSection } from "@/components/sections/hero-section";

const ErrorBox = ({ section }: { section: string }) => (
	<div className='container mx-auto px-6 my-4'>
		<div className='p-4 border border-destructive/20 bg-destructive/5 rounded-xl flex items-center gap-3 text-destructive/80'>
			<AlertCircle size={16} />
			<p className='text-xs font-medium'>
				Failed to load {section}. Please check your database configuration.
			</p>
		</div>
	</div>
);

/* --- Loaders --- */

import { AboutData, HeroData } from "@/types";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";

import { getProjects } from "@/server/data/projects";
import { ProjectsSection } from "@/components/sections/projects-section";
import { getBlogs } from "@/server/data/blogs";
import BlogSection from "@/components/sections/blog-section";
import { getPublicTestimonials } from "@/server/data/testimonial";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export async function HeroLoader({ locale }: { locale: Locale }) {
	const data = (await getHeroData(locale)) as HeroData;
	if (!data) {
		// نعرض الخطأ فقط في بيئة التطوير، وفي الإنتاج لا نعرض شيئاً للحفاظ على شكل الصفحة
		return process.env.NODE_ENV === "development" ? (
			<ErrorBox section='Hero' />
		) : null;
	}

	return <HeroSection data={data} locale={locale} />;
}
export async function AboutLoader({ locale }: { locale: Locale }) {
	const data = (await getAboutData(locale)) as AboutData | null;

	if (!data) {
		return process.env.NODE_ENV === "development" ? (
			<ErrorBox section='About' />
		) : null;
	}

	return <AboutSection aboutData={data} locale={locale} />;
}
export async function SkillsLoader({ locale }: { locale: Locale }) {
	const data = await getSkills(locale);
	if (!data) return null;
	return <SkillsSection initialData={data} locale={locale} />;
}
export async function ExperienceLoader({ locale }: { locale: Locale }) {
	const [expData, eduData] = await Promise.all([
		getExperiences(locale),
		getEducations(locale),
	]);
	if (!expData || !eduData) return null;
	return (
		<ExperienceSection expData={expData} eduData={eduData} locale={locale} />
	);
}
export async function ProjectLoader({ locale }: { locale: Locale }) {
	const data = await getProjects(locale);
	if (!data) return null;
	return <ProjectsSection projectsData={data} locale={locale} />;
}
export async function BlogLoader({ locale }: { locale: Locale }) {
	const data = await getBlogs(locale);
	if (!data) return null;
	return <BlogSection blogs={data} locale={locale} />;
}
export async function TestimonialsLoader({ locale }: { locale: Locale }) {
	const data = await getPublicTestimonials();
	if (!data) return null;
	return <TestimonialsSection data={data} locale={locale} />;
}
