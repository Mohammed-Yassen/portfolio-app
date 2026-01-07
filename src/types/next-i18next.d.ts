/** @format */
import { getRequestConfig } from "next-intl/server";
import { routing } from "./navigation";

export default getRequestConfig(async ({ requestLocale }) => {
	// تعريف النوع هنا يمنع خطأ "Unexpected any"
	const locale = (await requestLocale) as "en" | "ar";

	if (!routing.locales.includes(locale)) {
		return {
			locale: routing.defaultLocale,
			messages: (await import(`./messages/${routing.defaultLocale}.json`))
				.default,
		};
	}

	return {
		locale,
		messages: (await import(`./messages/${locale}.json`)).default,
	};
});
