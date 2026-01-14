/** @format */

import { UserRole, UserStatus } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: UserRole;
			status: UserStatus;
		} & DefaultSession["user"];
	}

	interface User {
		role: UserRole;
		status: UserStatus;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		sub: string;
		role: UserRole;
		status: UserStatus;
	}
}
