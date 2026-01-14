/** @format */
import { SignInForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
	params: Promise<{ locale: string }>;
};

// Dynamic Metadata for Multi-lang
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Auth" });

	return {
		title: `${t("signInTitle")} | Admin Portal`,
		description: t("signInDescription"),
	};
}

export default async function SignInPage({ params }: Props) {
	// Await params for Next.js 15 compliance
	await params;

	return (
		<main className='relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background px-4 py-20'>
			{/* Background Visuals */}
			<div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 -left-20 h-120 w-120 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse' />
				<div className='absolute bottom-1/4 -right-20 h-120 w-120 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700' />
			</div>

			<section className='relative z-10 w-full max-w-md'>
				<SignInForm />
			</section>

			<footer className='absolute bottom-4 text-center w-full text-xs text-muted-foreground/60'>
				&copy; {new Date().getFullYear()} Mohammed Yaseen.
			</footer>
		</main>
	);
}
