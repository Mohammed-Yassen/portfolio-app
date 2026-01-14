/** @format */
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Locale } from "@prisma/client";

import {
	AboutLoader,
	BlogLoader,
	CertificationLoader,
	ExperienceLoader,
	FooterLoader,
	HeroLoader,
	ProjectLoader,
	SkillsLoader,
	TestimonialsLoader,
} from "./loaders";
import {
	HeroSkeleton,
	FooterSkeleton,
	AboutSkeleton,
	SkillsSkeleton,
	ExperienceSkeleton,
	ProjectsSkeleton,
	BlogSkeleton,
	TestimonialsSkeleton,
	CertificationsSkeleton,
} from "@/components/sections/sections-skeleton";
import { HomeClientWrapper } from "./home-client-wrapper";
import { FloatingDock } from "@/components/floating-nav";
import { HomeHeader } from "@/components/buttons-header";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/footer";
import { ContactSectionForm } from "@/components/sections/contact-section";
import { ServicesSection } from "@/components/sections/services-section";

const DEFAULT_UI_CONFIG = {
	navActive: true,
	heroActive: true,
	aboutActive: true,
	skillActive: true,
	experienceActive: true,
	projectActive: true,
	blogActive: true,
	contactActive: true,
	testimonialActive: true,
	footerActive: true,
};

interface HomeProps {
	params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
	const { locale: rawLocale } = await params;
	const config = await prisma.sectionActive.findUnique({
		where: { id: "ui-config" },
	});

	// 2. Merge defaults with DB values
	const ui = { ...DEFAULT_UI_CONFIG, ...config };
	// Validate and cast locale
	const locale = Object.values(Locale).find((l) => l === rawLocale);
	if (!locale) notFound();

	const isRtl = locale === "ar";
	const session = await auth();

	return (
		<HomeClientWrapper>
			{/* We wrap the main content in a div with 'dir' to handle 
               Arabic vs English alignment automatically 
            */}
			<div
				dir={isRtl ? "rtl" : "ltr"}
				className={isRtl ? "font-arabic" : "font-sans"}>
				{ui.navActive && <FloatingDock locale={locale} />}

				<HomeHeader user={session?.user} />

				{ui.heroActive && (
					<Suspense fallback={<HeroSkeleton />}>
						<HeroLoader locale={locale} />
					</Suspense>
				)}

				{ui.aboutActive && (
					<Suspense fallback={<AboutSkeleton />}>
						<AboutLoader locale={locale} />
					</Suspense>
				)}
				{ui.testimonialActive && (
					<Suspense fallback={<TestimonialsSkeleton />}>
						<TestimonialsLoader locale={locale} />
					</Suspense>
				)}
				{ui.skillActive && (
					<Suspense fallback={<SkillsSkeleton />}>
						<SkillsLoader locale={locale} />
					</Suspense>
				)}
				{ui.experienceActive && (
					<Suspense fallback={<ExperienceSkeleton />}>
						<ExperienceLoader locale={locale} />
					</Suspense>
				)}
				{ui.certificationActive && (
					<Suspense fallback={<CertificationsSkeleton />}>
						<CertificationLoader locale={locale} />
					</Suspense>
				)}
				{ui.projectActive && (
					<Suspense fallback={<ProjectsSkeleton />}>
						<ProjectLoader locale={locale} />
					</Suspense>
				)}
				{ui.blogActive && (
					<Suspense fallback={<BlogSkeleton />}>
						<BlogLoader locale={locale} />
					</Suspense>
				)}
				{ui.contactActive && (
					<Suspense fallback={<BlogSkeleton />}>
						<ContactSectionForm />
					</Suspense>
				)}
				{ui.contactActive && (
					<Suspense fallback={<BlogSkeleton />}>
						<ServicesSection />
					</Suspense>
				)}

				{ui.footerActive && (
					<Suspense fallback={<FooterSkeleton />}>
						<FooterLoader locale={locale} />
					</Suspense>
				)}
			</div>
		</HomeClientWrapper>
	);
}
