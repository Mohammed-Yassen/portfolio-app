/** @format */
import { getRequestConfig } from "next-intl/server";
import { routing } from "./navigation";

export default getRequestConfig(async ({ requestLocale }) => {
	// 1. Await the locale (Required in Next.js 15)
	const locale = await requestLocale;

	// 2. Validate against supported locales
	const targetLocale =
		locale && routing.locales.includes(locale as "ar" | "en")
			? (locale as "en" | "ar")
			: (routing.defaultLocale as "en" | "ar");

	try {
		// 3. Dynamic import relative to this file's location (src/i18n.ts)
		// This looks for src/messages/en.json or src/messages/ar.json
		const messages = (await import(`./messages/${targetLocale}.json`)).default;

		return {
			locale: targetLocale,
			messages,
		};
	} catch (error) {
		console.error(
			`🚨 i18n Error: Could not load messages for "${targetLocale}".`,
			error,
		);

		// 4. Fallback to default locale if the requested one fails to load
		const fallbackMessages = (
			await import(`./messages/${routing.defaultLocale}.json`)
		).default;

		return {
			locale: routing.defaultLocale,
			messages: fallbackMessages,
		};
	}
});
