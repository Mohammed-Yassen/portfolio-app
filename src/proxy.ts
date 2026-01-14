/** @format */
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// 1. Identify Route Types
	const pathname = nextUrl.pathname;
	const localePattern = `^/(${routing.locales.join("|")})`;
	const pathWithoutLocale =
		pathname.replace(new RegExp(localePattern), "") || "/";

	const isApiAuthRoute = pathname.startsWith("/api/auth");
	const isDashboardRoute = pathWithoutLocale.startsWith("/admin");
	const isAuthPage = pathWithoutLocale.startsWith("/auth");

	// 2. Allow API Auth calls
	if (isApiAuthRoute) return undefined;

	// 3. Basic Redirects (Authentication Only)
	// Detailed Role/Status checks will be handled inline in your pages
	if (isDashboardRoute && !isLoggedIn) {
		const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
		return Response.redirect(
			new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, nextUrl),
		);
	}

	if (isAuthPage && isLoggedIn) {
		return Response.redirect(new URL("/", nextUrl));
	}

	// 4. Apply Internationalization
	return intlMiddleware(req);
});

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
