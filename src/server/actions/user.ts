/** @format */
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProfileFormValues, ProfileSchema } from "../validations/user";
import { UserRole } from "@prisma/client";
import { getUserRole } from "../data/users";

export async function updateProfile(values: ProfileFormValues) {
	try {
		// 1. Session & Identity Verification
		const session = await auth();
		const userId = session?.user?.id;

		if (!userId) {
			return { error: "Session expired. Please log in again." };
		}

		// 2. Server-side Validation
		const validatedFields = ProfileSchema.safeParse(values);
		if (!validatedFields.success) {
			return { error: "Validation failed. Please check your inputs." };
		}

		const {
			name,
			image,
			phone,
			professionalEmail,
			resumeUrl,
			socials,
			bio,
			location,
		} = validatedFields.data;

		// 3. Execution via ACID Transaction
		await prisma.$transaction(async (tx) => {
			// Verify role within the transaction for data consistency
			const user = await tx.user.findUnique({
				where: { id: userId },
				select: { role: true },
			});

			if (!user || user.role !== UserRole.ADMIN) {
				throw new Error("UNAUTHORIZED");
			}

			// A. Update Base User
			await tx.user.update({
				where: { id: userId },
				data: {
					name: name.trim(),
					image: image || null,
				},
			});

			// B. Upsert Profile & Nested Translations
			const profile = await tx.profile.upsert({
				where: { userId },
				create: {
					userId,
					phone: phone?.trim() || null,
					professionalEmail: professionalEmail.trim().toLowerCase(),
					resumeUrl: resumeUrl || null,
					translations: {
						create: {
							locale: "en", // Default locale
							bio: bio?.trim() || "",
							location: location?.trim() || "",
						},
					},
				},
				update: {
					phone: phone?.trim() || null,
					professionalEmail: professionalEmail.trim().toLowerCase(),
					resumeUrl: resumeUrl || null,
					translations: {
						// Senior approach: Delete existing to avoid duplicates in simple schemas
						// or use an upsert if you have translation IDs.
						deleteMany: { locale: "en" },
						create: {
							locale: "en",
							bio: bio?.trim() || "",
							location: location?.trim() || "",
						},
					},
				},
			});

			// C. Sync Social Links (Delete + Recreate is safer for nested arrays)
			await tx.socialLinks.deleteMany({ where: { profileId: profile.id } });

			if (socials && socials.length > 0) {
				await tx.socialLinks.createMany({
					data: socials.map((s) => ({
						profileId: profile.id,
						name: s.name.trim(),
						url: s.url.trim(),
						icon: s.icon || null,
					})),
				});
			}
		});

		// 4. Cache Management
		revalidatePath("/admin/users");
		return { success: "Profile and administrative settings updated." };
	} catch (error: unknown) {
		// Senior approach: Check if it's an instance of the Error object
		if (error instanceof Error && error.message === "UNAUTHORIZED") {
			return { error: "Access denied: Insufficient permissions." };
		}

		// Log the actual error for server-side debugging
		console.error("[UPDATE_PROFILE_ACTION_ERROR]:", error);

		return { error: "A server error occurred during update." };
	}
}
/** @format */
// Helper to verify Admin
async function verifyAdmin() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}
	const userRole = await getUserRole(session?.user?.id);
	if (userRole !== UserRole.ADMIN) {
		throw new Error("Unauthorized");
	}

	return session.user.id;
}

export async function updateRole(userId: string, role: UserRole) {
	try {
		const adminId = await verifyAdmin();
		if (userId === adminId)
			return { error: "You cannot change your own role ." };

		await prisma.user.update({ where: { id: userId }, data: { role } });
		revalidatePath("/admin/users");
		return { success: "Role updated." };
	} catch (e) {
		return { error: "Failed to update role." };
	}
}

export async function deleteUser(userId: string) {
	try {
		const adminId = await verifyAdmin();
		if (userId === adminId) return { error: "You cannot delete yourself." };

		await prisma.user.delete({ where: { id: userId } });
		revalidatePath("/admin/users");
		return { success: "User deleted." };
	} catch (e) {
		return { error: "Failed to delete user." };
	}
}
