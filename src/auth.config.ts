/** @format */
import { UserRole, UserStatus } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
	pages: {
		signIn: "/auth/sign-in",
		newUser: "/auth/sign-up",
	},
	callbacks: {
		// 1. JWT Callback: This is the critical bridge.
		// It persists data from the Database to the Token.
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.role = user.role;
				token.status = user.status;
				token.id = user.id;
			}

			// Allows real-time session updates without logging out
			if (trigger === "update" && session) {
				return { ...token, ...session.user };
			}

			return token;
		},

		// 2. Session Callback: Passes data from the Token to the Client/Middleware.
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as UserRole;
				session.user.status = token.status as UserStatus;
			}
			return session;
		},

		// 3. Authorization logic for Middleware
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const role = auth?.user?.role;
			const status = auth?.user?.status;

			// Block Banned/Deleted users immediately
			if (isLoggedIn && (status === "BANNED" || status === "DELETED")) {
				return false;
			}

			const isAdminRoute = nextUrl.pathname.match(/\/(admin|dashboard)/);
			if (isAdminRoute) {
				const hasAdminPower = ["ADMIN", "SUPER_ADMIN", "OWNER"].includes(
					role || "",
				);
				return isLoggedIn && hasAdminPower;
			}

			return true;
		},
	},
	providers: [
		GitHub,
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			profile(profile) {
				// AUTO-PROMOTE OWNER (Replace with your actual admin email)
				const isOwner = profile.email === "your-email@gmail.com";
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					role: isOwner ? "OWNER" : "USER",
					status: "ACTIVE",
				};
			},
		}),
	],
} satisfies NextAuthConfig;
