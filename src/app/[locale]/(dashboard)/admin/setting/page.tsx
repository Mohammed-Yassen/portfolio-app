/** @format */
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
	LayoutDashboard,
	User,
	Wrench,
	Briefcase,
	type LucideIcon,
	GraduationCap,
	Activity,
	Award,
} from "lucide-react";
import { Locale } from "@prisma/client";

import {
	getHeroData,
	getAboutData,
	getSkills,
	getExperiences,
	getEducations,
	getCertifications,
} from "@/server/data";
import {
	DashboardAboutSkeleton,
	DashboardHeroSkeleton,
	DashboardSkillSkeleton,
} from "@/components/dashboard/dash-skeleton";
import { AboutForm } from "@/components/dashboard/dash-form/about-form";
import { HeroForm } from "@/components/dashboard/dash-form/hero-form";
import { SkillsForm } from "@/components/dashboard/dash-form/skills-form";
import { ExperienceForm } from "@/components/dashboard/dash-form/experienc-form";
import { EducationForm } from "@/components/dashboard/dash-form/education-form";
import prisma from "@/lib/prisma";
import { SectionActivationClient } from "@/components/dashboard/dash-form/sections-activation";
import { CertificationForm } from "@/components/dashboard/dash-form/certification-form";
import { CertificationsSkeleton } from "@/components/sections/sections-skeleton";
import { FaCertificate } from "react-icons/fa";

interface Props {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ tab?: string }>;
}

export default async function ControlPage({ params, searchParams }: Props) {
	const [{ locale }, { tab }] = await Promise.all([params, searchParams]);

	// Robust Locale Validation
	const validLocale = Object.values(Locale).find((l) => l === locale);
	if (!validLocale) notFound();

	const activeTab = tab ?? "hero";

	return (
		<main className='min-h-screen bg-zinc-50/50 dark:bg-zinc-950 transition-colors'>
			{/* Sticky Header */}
			<header className='sticky top-0 z-30 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md'>
				<div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='h-8 w-1 bg-indigo-600 rounded-full' />
						<h1 className='text-lg font-semibold tracking-tight'>
							System Control
						</h1>
					</div>
					<div className='flex items-center gap-3'>
						<span className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
							Region
						</span>
						<div className='text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700'>
							{validLocale}
						</div>
					</div>
				</div>
			</header>

			<div className='max-w-7xl mx-auto px-4 py-8'>
				<Tabs value={activeTab} className='space-y-6'>
					{/* Navigation with URL Sync */}
					<TabsList className='w-full justify-start h-auto p-0 bg-transparent border-b rounded-none gap-2 sm:gap-6 overflow-x-auto no-scrollbar'>
						<TabNav
							trigger='hero'
							icon={LayoutDashboard}
							label='Hero'
							locale={validLocale}
						/>
						<TabNav
							trigger='about'
							icon={User}
							label='About'
							locale={validLocale}
						/>
						<TabNav
							trigger='skills'
							icon={Wrench}
							label='Skills'
							locale={validLocale}
							// disabled
						/>
						<TabNav
							trigger='experiences'
							icon={Briefcase}
							label='Experience'
							locale={validLocale}
							// disabled
						/>
						<TabNav
							trigger='education'
							icon={GraduationCap}
							label='Education'
							locale={validLocale}
							// disabled
						/>
						<TabNav
							trigger='certification'
							icon={Award}
							label='Certification'
							locale={validLocale}
							// disabled
						/>
						<TabNav
							trigger='activations'
							icon={Activity}
							label='Activations'
							locale={validLocale}
							// disabled
						/>
					</TabsList>

					{/* Content Areas with Fixed Minimum Heights to reduce jitter */}
					<div className='mt-6 min-h-[50vh]'>
						<TabsContent value='hero' className='outline-none m-0'>
							<Suspense fallback={<DashboardHeroSkeleton />}>
								<HeroTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>

						<TabsContent value='about' className='outline-none m-0'>
							<Suspense fallback={<DashboardAboutSkeleton />}>
								<AboutTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>
						<TabsContent value='skills' className='outline-none m-0'>
							<Suspense fallback={<DashboardSkillSkeleton />}>
								<SkillsTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>
						<TabsContent value='experiences' className='outline-none m-0'>
							<Suspense fallback={<DashboardSkillSkeleton />}>
								<ExperienceTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>
						<TabsContent value='education' className='outline-none m-0'>
							<Suspense fallback={<DashboardSkillSkeleton />}>
								<EducationTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>
						<TabsContent value='certification' className='outline-none m-0'>
							<Suspense fallback={<CertificationsSkeleton />}>
								<CertificationTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>

						<TabsContent value='activations' className='outline-none m-0'>
							<Suspense fallback={<DashboardSkillSkeleton />}>
								<ActiveTabContent locale={validLocale} />
							</Suspense>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</main>
	);
}

/** * Data Fetching Components (Server Components)
 */
async function HeroTabContent({ locale }: { locale: Locale }) {
	const data = await getHeroData(locale);
	if (!data) return null;
	return <HeroForm initialData={data} locale={locale} />;
}

async function AboutTabContent({ locale }: { locale: Locale }) {
	const data = await getAboutData(locale);
	if (!data) return null;
	return <AboutForm aboutData={data} locale={locale} />;
}

async function SkillsTabContent({ locale }: { locale: Locale }) {
	const data = await getSkills(locale);
	console.log("from SkillsTabContent ", data);
	if (!data) return null;
	return <SkillsForm initialData={data} locale={locale} />;
}
async function ExperienceTabContent({ locale }: { locale: Locale }) {
	const data = await getExperiences(locale);
	if (!data) return null;
	return <ExperienceForm initialData={data} locale={locale} />;
}
async function EducationTabContent({ locale }: { locale: Locale }) {
	const data = await getEducations(locale);
	if (!data) return null;
	return <EducationForm initialData={data} locale={locale} />;
}
async function CertificationTabContent({ locale }: { locale: Locale }) {
	const data = await getCertifications(locale);
	if (!data) return null;
	return <CertificationForm initialData={data} locale={locale} />;
}
async function ActiveTabContent({ locale }: { locale: Locale }) {
	const config = await prisma.sectionActive.findUnique({
		where: { id: "ui-config" },
	});
	console.log("active config", config);
	// if (!config) return null;
	return <SectionActivationClient config={config} locale={locale} />;
}

function TabNav({
	trigger,
	icon: Icon,
	label,
	locale,
	disabled,
}: {
	trigger: string;
	icon: LucideIcon;
	label: string;
	locale: string;
	disabled?: boolean;
}) {
	const content = (
		<TabsTrigger
			value={trigger}
			disabled={disabled}
			className='flex items-center gap-2 px-1 py-4 border-b-2 border-transparent 
                text-zinc-500 transition-all bg-transparent shadow-none rounded-none
                data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600
                hover:text-zinc-800 dark:hover:text-zinc-200
                disabled:opacity-30 disabled:cursor-not-allowed select-none'>
			<Icon size={18} strokeWidth={2.5} />
			<span className='text-sm font-bold tracking-tight'>{label}</span>
		</TabsTrigger>
	);

	if (disabled) return content;

	return (
		<Link
			href={`/${locale}/admin/setting?tab=${trigger}`}
			scroll={false}
			replace>
			{content}
		</Link>
	);
}
