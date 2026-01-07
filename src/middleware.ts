/** @format */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";

const { auth } = NextAuth(authConfig);

const ROUTE_AUTH_SIGN_IN = "/auth/sign-in";
const ROUTE_AUTH_SIGN_UP = "/auth/sign-up";
const ROUTE_DASHBOARD = "/admin";
const ROUTE_HOME = "/";

// 1. Initialize the i18n middleware
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	console.log(isLoggedIn);

	// Note: Ensure your session includes the role in auth.config.ts callbacks
	const userRole = "ADMIN";
	// req.auth?.user?.role || "USER";

	// Helper to check path regardless of locale (e.g., /en/dashboard -> /dashboard)
	const pathname = nextUrl.pathname;
	const localePattern = `^/(${routing.locales.join("|")})`;
	const pathWithoutLocale =
		pathname.replace(new RegExp(localePattern), "") || "/";

	const isApiAuthRoute = pathname.startsWith("/api/auth");
	const isDashboardRoute = pathWithoutLocale.startsWith(ROUTE_DASHBOARD);
	const isAuthRoute = [ROUTE_AUTH_SIGN_IN, ROUTE_AUTH_SIGN_UP].includes(
		pathWithoutLocale,
	);

	// --- 1. Pass-through for NextAuth internal API calls ---
	if (isApiAuthRoute) return undefined;

	// --- 2. Handle Authentication Pages (Sign-in / Sign-up) ---
	if (isAuthRoute) {
		if (isLoggedIn) {
			const destination = userRole === "ADMIN" ? ROUTE_DASHBOARD : ROUTE_HOME;
			// We use the original nextUrl to preserve the locale prefix if present
			return Response.redirect(new URL(destination, nextUrl));
		}
		// If not logged in, let it pass to intlMiddleware to handle locale
		return intlMiddleware(req);
	}

	// --- 3. Strict Protection Logic ---
	if (isDashboardRoute) {
		if (!isLoggedIn) {
			let callbackUrl = pathname;
			if (nextUrl.search) callbackUrl += nextUrl.search;
			const encodedCallbackUrl = encodeURIComponent(callbackUrl);

			return Response.redirect(
				new URL(
					`${ROUTE_AUTH_SIGN_IN}?callbackUrl=${encodedCallbackUrl}`,
					nextUrl,
				),
			);
		}

		if (userRole !== "ADMIN") {
			return Response.redirect(new URL(ROUTE_HOME, nextUrl));
		}
	}

	// --- 4. Final Step: Apply i18n for all other routes ---
	return intlMiddleware(req);
});

export const config = {
	// Match all paths except static files and internal Next.js paths
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
