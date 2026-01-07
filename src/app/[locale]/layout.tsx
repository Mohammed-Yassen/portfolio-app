/** @format */
import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/navigation";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
	variable: "--font-arabic",
	weight: ["400", "700"],
	subsets: ["arabic"],
});

// Next.js 15 requires params to be a Promise in generateMetadata
export async function generateMetadata(props: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await props.params;
	const t = await getTranslations({ locale, namespace: "Metadata" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function RootLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// 1. Await params immediately (Next.js 15 Requirement)
	const { locale } = await props.params;

	// 2. Validate locale
	if (!routing.locales.includes(locale as "ar" | "en")) {
		notFound();
	}

	// 3. Fetch messages for the Client Provider
	// This is often where "database errors" appear if i18n.ts is misconfigured
	const messages = await getMessages();
	const isArabic = locale === "ar";

	return (
		<html lang={locale} dir={isArabic ? "rtl" : "ltr"} suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen antialiased",
					geistSans.variable,
					isArabic ? ibmPlexArabic.variable : "",
					isArabic ? "font-arabic" : "font-sans",
				)}>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange>
						{props.children}
						<Toaster position='top-center' richColors />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
