/** @format */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { BackButton } from "@/components/back-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MotionSection } from "@/components/shared/motion-viewport";
import { TestimonialForm } from "./testemonial-form";
import { AuthUser } from "@/types/user";
import { Badge } from "@/components/ui/badge";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function NewTestimonialPage({ params }: Props) {
	const { locale } = await params;
	const session = await auth();
	const t = await getTranslations("NewTestimonialPage");
	const isRtl = locale === "ar";

	if (!session?.user) {
		redirect(`/api/auth/signin?callbackUrl=/${locale}/testimonials/new`);
	}

	return (
		<main
			className='relative bg-background text-foreground min-h-screen selection:bg-primary/30 py-16 md:pb-24'
			dir={isRtl ? "rtl" : "ltr"}>
			{/* Global background effects */}
			<div
				className='absolute inset-0 z-0 opacity-[0.05] pointer-events-none'
				style={{
					backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
					backgroundSize: "3rem 3rem",
				}}
			/>
			<div className='container max-w-2xl mx-auto px-6'>
				{/* Header Navigation */}
				<div className='flex items-center justify-between '>
					<BackButton
						title={t("cancel")}
						fallback={`/${locale}/testimonials`}
						variant='outline'
						className='rounded-full px-4 border-zinc-200 dark:border-zinc-800'
					/>
					<Badge
						variant='secondary'
						className='font-mono tracking-tighter uppercase'>
						{t("step", { current: 1, total: 1 })}
					</Badge>
				</div>

				<MotionSection preset='scaleUp'>
					<header className='text-center mb-4 space-y-3'>
						<h1 className='text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500'>
							{t("title")}
						</h1>
						<p className='text-muted-foreground text-balance max-w-md mx-auto leading-relaxed'>
							{t("description")}
						</p>
					</header>

					{/* Identity Bar - Modern Glass style */}
					<div className='group relative mb-8 p-4 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/50'>
						<Avatar className='h-14 w-14 ring-4 ring-white dark:ring-zinc-950 shadow-sm'>
							<AvatarImage
								src={session.user.image ?? ""}
								alt={session.user.name ?? ""}
							/>
							<AvatarFallback className='bg-primary text-primary-foreground font-bold'>
								{session.user.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium truncate'>
								{/* The ?? "User" ensures the value is never null/undefined */}
								{t("postingAs", { name: session?.user?.name ?? "User" })}
							</p>
							<p className='text-xs text-muted-foreground truncate'>
								{session?.user?.email}
							</p>
						</div>
						<Badge className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none'>
							{t("verified")}
						</Badge>
					</div>

					<TestimonialForm locale={locale} user={session.user as AuthUser} />

					<footer className='mt-2 text-center'>
						<p className='text-[11px] text-muted-foreground uppercase tracking-widest opacity-60 max-w-xs mx-auto'>
							{t("disclaimer")}
						</p>
					</footer>
				</MotionSection>
			</div>
		</main>
	);
}
