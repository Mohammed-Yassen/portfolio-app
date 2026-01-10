/** @format */
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Locale } from "@prisma/client";

import {
	AboutLoader,
	BlogLoader,
	ExperienceLoader,
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
} from "@/components/sections/sections-skeleton";
import { HomeClientWrapper } from "./home-client-wrapper";
import { FloatingDock } from "@/components/floating-nav";
import { HomeHeader } from "@/components/buttons-header";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/footer";
import { ContactSectionForm } from "@/components/sections/contact-section";

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

				<main className='flex flex-col w-full overflow-x-hidden'>
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

					{ui.footerActive && (
						<Suspense fallback={<FooterSkeleton />}>
							<Footer />
							<footer className='py-10 text-center border-t border-border/40'>
								<p className='text-muted-foreground text-sm'>
									© 2026 Portfolio
								</p>
							</footer>
						</Suspense>
					)}
				</main>
			</div>
		</HomeClientWrapper>
	);
}
