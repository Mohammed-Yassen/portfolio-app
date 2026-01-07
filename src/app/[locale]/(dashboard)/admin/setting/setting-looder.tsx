/** @format */
import { Locale } from "@prisma/client";
import { HeroForm } from "@/components/dashboard/dash-form/hero-form";
import { AboutForm } from "@/components/dashboard/dash-form/about-form";
import { HeroData, AboutData } from "@/types";

/* -------------------------------------------------- */
/* Hero Loader (Render Only)                           */
/* -------------------------------------------------- */
export function HeroLoader({
	data,
	locale,
}: {
	data: HeroData | null;
	locale: Locale;
}) {
	if (!data) return null;
	return <HeroForm initialData={data} locale={locale} />;
}

/* -------------------------------------------------- */
/* About Loader (Render Only)                          */
/* -------------------------------------------------- */
export function AboutLoader({
	data,
	locale,
}: {
	data: AboutData | null;
	locale: Locale;
}) {
	return <AboutForm aboutData={data} locale={locale} />;
}
export function SkillsLoader({
	data,
	locale,
}: {
	data: AboutData | null;
	locale: Locale;
}) {
	return <AboutForm aboutData={data} locale={locale} />;
}
