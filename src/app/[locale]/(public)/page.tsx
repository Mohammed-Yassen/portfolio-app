/** @format */
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Locale } from "@prisma/client";

import {
	AboutLoader,
	ExperienceLoader,
	HeroLoader,
	ProjectLoader,
	SkillsLoader,
} from "./loaders";
import {
	HeroSkeleton,
	FooterSkeleton,
	AboutSkeleton,
	SkillsSkeleton,
	ExperienceSkeleton,
	ProjectsSkeleton,
} from "@/components/sections/sections-skeleton";
import { HomeClientWrapper } from "./home-client-wrapper";
import { FloatingDock } from "@/components/floating-nav";
import { HomeHeader } from "@/components/buttons-header";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/footer";

// في Next.js، الصفحة تستقبل params تحتوي على اللغة
interface HomeProps {
	params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
	const { locale: rawLocale } = await params;

	// Validate and cast locale
	const locale = Object.values(Locale).find((l) => l === rawLocale);
	if (!locale) notFound();

	const isRtl = locale === "ar";
	const session = await auth();

	const ui = {
		navActive: true,
		heroActive: true,
		aboutActive: true,
		skillActive: true,
		experienceActive: true,
		prokectsActive: true,
		contactActive: true,
		footerActive: true,

		// ...dbConfig,
	};

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
					{ui.skillActive && (
						<Suspense fallback={<SkillsSkeleton />}>
							<SkillsLoader locale={locale} />
						</Suspense>
					)}
					{ui.skillActive && (
						<Suspense fallback={<ExperienceSkeleton />}>
							<ExperienceLoader locale={locale} />
						</Suspense>
					)}
					{ui.skillActive && (
						<Suspense fallback={<ProjectsSkeleton />}>
							<ProjectLoader locale={locale} />
						</Suspense>
					)}

					{ui.footerActive && (
						<Suspense fallback={<FooterSkeleton />}>
							{/* <footer className='py-10 text-center border-t border-border/40'>
								<p className='text-muted-foreground text-sm'>
									© 2026 Portfolio
								</p>
							</footer> */}
							<Footer />
						</Suspense>
					)}
				</main>
			</div>
		</HomeClientWrapper>
	);
}
