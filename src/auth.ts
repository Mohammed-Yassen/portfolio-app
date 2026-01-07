/** @format */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { type Adapter } from "next-auth/adapters";
import { UserRole } from "@prisma/client";
import prisma from "./lib/prisma";
import { loginSchema } from "./server/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma) as Adapter,
	session: { strategy: "jwt" },
	...authConfig,
	providers: [
		...authConfig.providers,
		Credentials({
			async authorize(credentials) {
				const validated = loginSchema.safeParse(credentials);
				if (!validated.success) return null;

				const { email, password } = validated.data;
				const user = await prisma.user.findUnique({ where: { email } });

				// Security: OAuth users won't have a password
				if (!user || !user.password) return null;

				const passwordsMatch = await bcrypt.compare(password, user.password);
				if (passwordsMatch) return user;

				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger }) {
			// 1. On Login: Transfer data from Database (user) to the Token
			if (user) {
				token.role = user.role;
				token.name = user.name;
				token.email = user.email;
			}

			// 2. On Demand: Update session data without re-logging
			if (trigger === "update") {
				const existingUser = await prisma.user.findUnique({
					where: { id: token.sub },
					select: { role: true, name: true, email: true },
				});

				if (existingUser) {
					token.role = existingUser.role;
					token.name = existingUser.name;
					token.email = existingUser.email;
				}
			}

			return token;
		},
		async session({ session, token }) {
			// Because of your next-auth.d.ts, this is now 100% type-safe
			if (session.user) {
				if (token.sub) session.user.id = token.sub;
				if (token.role) session.user.role = token.role as UserRole;
				if (token.email) session.user.email = token.email;
				if (token.name) session.user.name = token.name;
			}

			return session;
		},
	},
});
