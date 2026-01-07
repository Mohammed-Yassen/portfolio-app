/** @format */
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "ar"],

	// Used when no locale matches
	defaultLocale: "en",

	// Optional: Prevent prefix for default locale (e.g., /about instead of /en/about)
	localePrefix: "always",
});

// These utilities help with navigation while maintaining the locale
export const { Link, redirect, usePathname, useRouter } =
	createNavigation(routing);
