/** @format */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BackButton } from "@/components/back-button";
import {
	MessageSquare,
	Star,
	Clock,
	LucideIcon,
	ShieldCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TestimonialTable } from "@/app/[locale]/(dashboard)/admin/testimonials/testimonial-table";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface AdminPageProps {
	params: Promise<{ locale: string }>;
}

export default async function AdminTestimonialsPage({
	params,
}: AdminPageProps) {
	const { locale } = await params;
	const isRtl = locale === "ar";
	const session = await auth();
	const t = await getTranslations("AdminTestimonials");

	// 1. Strict Security Guard: Type-safe role check
	if (session?.user?.role !== "USER") {
		redirect(`/${locale}`);
	}

	// 2. Parallel Data Fetching
	const [testimonials, total, pending, featured] = await Promise.all([
		prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
		prisma.testimonial.count(),
		prisma.testimonial.count({ where: { isActive: false } }),
		prisma.testimonial.count({ where: { isFeatured: true } }),
	]);

	return (
		<div
			className='min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors duration-500'
			dir={isRtl ? "rtl" : "ltr"}>
			{/* Header: Glassmorphism Effect */}
			<header className='sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl'>
				<div className='container max-w-7xl mx-auto h-16 flex items-center justify-between px-6'>
					<div className='flex items-center gap-4'>
						<BackButton
							fallback={`/${locale}/dashboard`}
							title={t("adminPanel")}
							variant='ghost'
						/>
						<Separator orientation='vertical' className='h-6 opacity-50' />
						<div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10'>
							<ShieldCheck className='w-4 h-4 text-primary' />
							<span className='text-xs font-bold tracking-tight text-primary uppercase'>
								{t("moderationMode")}
							</span>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<div className='hidden md:block text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800'>
							v1.0.4-STABLE
						</div>
					</div>
				</div>
			</header>

			<main className='container max-w-7xl mx-auto p-6 md:p-10 space-y-10'>
				{/* Hero Title Section */}
				<div className='flex flex-col gap-2'>
					<h1 className='text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50'>
						{t("moderationQueue")}
					</h1>
					<p className='text-zinc-500 dark:text-zinc-400 text-sm max-w-prose leading-relaxed'>
						{t("moderationDescription")}
					</p>
				</div>

				{/* Stats Grid: Modern Floating Cards */}
				<div className='grid gap-6 md:grid-cols-3'>
					<StatCard
						title={t("total")}
						value={total}
						icon={MessageSquare}
						accent='blue'
						locale={locale}
					/>
					<StatCard
						title={t("pendingApproval")}
						value={pending}
						icon={Clock}
						accent='amber'
						locale={locale}
					/>
					<StatCard
						title={t("featured")}
						value={featured}
						icon={Star}
						accent='emerald'
						locale={locale}
					/>
				</div>

				{/* Main Table Area: Soft Shadow Container */}
				<div className='relative group'>
					<div className='absolute -inset-1 bg-linear-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>
					<div className='relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden'>
						<TestimonialTable data={testimonials} locale={locale} />
					</div>
				</div>
			</main>
		</div>
	);
}

/** * Type-Safe StatCard Component
 */
interface StatCardProps {
	title: string;
	value: number;
	icon: LucideIcon;
	accent: "blue" | "amber" | "emerald";
	locale: string;
}

function StatCard({ title, value, icon: Icon, accent, locale }: StatCardProps) {
	const isRtl = locale === "ar";

	const colorMap = {
		blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
		amber:
			"text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
		emerald:
			"text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
	};

	return (
		<div className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300'>
			<div className={cn("space-y-1", isRtl ? "text-right" : "text-left")}>
				<p className='text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500'>
					{title}
				</p>
				<p className='text-3xl font-black text-zinc-900 dark:text-zinc-50'>
					{value.toLocaleString(locale)}
				</p>
			</div>
			<div
				className={cn(
					"p-4 rounded-xl border transition-transform group-hover:scale-110 duration-300",
					colorMap[accent],
				)}>
				<Icon className='w-6 h-6' />
			</div>
		</div>
	);
}
