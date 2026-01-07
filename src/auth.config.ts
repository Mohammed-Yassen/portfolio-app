/** @format */
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
	pages: {
		signIn: "/auth/sign-in",
		newUser: "/auth/sign-up",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const role = auth?.user?.role;

			const isAdminRoute = nextUrl.pathname.startsWith("/admin");
			const isUserDashboard = nextUrl.pathname.startsWith("/dashboard");

			// 1. Admin Protection
			if (isAdminRoute) {
				if (isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN"))
					return true;
				return false; // Redirects to sign-in
			}

			// 2. User Dashboard Protection
			if (isUserDashboard) {
				if (isLoggedIn) return true;
				return false;
			}

			return true;
		},
	},
	providers: [
		GitHub,
		Google,
		// Credentials provider goes in auth.ts because it needs bcrypt (Node.js)
	],
} satisfies NextAuthConfig;
