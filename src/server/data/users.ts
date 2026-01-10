/** @format */

import prisma from "@/lib/prisma";
import { UserWithProfile } from "@/types/user";

// Reusable selection object to ensure no password is ever leaked
const safeUserInclude = {
	profile: {
		include: {
			socials: true,
			translations: true,
		},
	},
} as const;

export async function getUserWithProfile(
	userId: string,
): Promise<UserWithProfile | null> {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: safeUserInclude,
		});

		if (!user) return null;

		// Remove password field manually if not using 'select'
		const { password, ...safeUser } = user;
		return safeUser as UserWithProfile;
	} catch (error) {
		console.error("[GET_USER_WITH_PROFILE_ERROR]:", error);
		return null;
	}
}

export async function getAllUsersWithProfiles(): Promise<UserWithProfile[]> {
	try {
		const users = await prisma.user.findMany({
			include: safeUserInclude,
			orderBy: { createdAt: "desc" },
		});

		return users.map(({ password, ...user }) => user as UserWithProfile);
	} catch (error) {
		console.error("[GET_ALL_USERS_ERROR]:", error);
		return [];
	}
}
export async function getUserRole(id: string): Promise<string | null> {
	try {
		const user = await prisma.user.findUnique({
			where: { id: id },
			select: { role: true },
		});
		return user?.role || null;
	} catch (error) {
		console.error("[GET_USER_ROLE_ERROR]:", error);
		return null;
	}
}
