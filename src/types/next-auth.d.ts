/** @format */
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: UserRole;
		} & DefaultSession["user"];
	}

	interface User {
		role?: UserRole;
	}
}

// This block specifically fixes the Adapter mismatch error
declare module "@auth/core/adapters" {
	interface AdapterUser {
		role?: UserRole;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: UserRole;
	}
}
