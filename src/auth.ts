/** @format */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import { loginSchema } from "./server/validations/auth";
import { UserRole, UserStatus } from "@prisma/client";
import { type Adapter } from "next-auth/adapters";
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

				if (!user || !user.password || user.status !== "ACTIVE") return null;

				const passwordsMatch = await bcrypt.compare(password, user.password);
				if (!passwordsMatch) return null;

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger }) {
			if (user) {
				token.sub = user.id;
				token.role = user.role;
				token.status = user.status;
			}

			if (trigger === "update" && token.sub) {
				const dbUser = await prisma.user.findUnique({
					where: { id: token.sub },
					select: { role: true, status: true, name: true, image: true },
				});
				if (dbUser) {
					token.role = dbUser.role;
					token.status = dbUser.status;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.sub as string;
				session.user.role = token.role as UserRole;
				session.user.status = token.status as UserStatus;
			}
			return session;
		},
	},
});
