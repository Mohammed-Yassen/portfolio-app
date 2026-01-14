/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProfileFormValues, ProfileSchema } from "../validations/user";
import { Locale, UserRole } from "@prisma/client";
import { z } from "zod";
import { createSecureAction } from "@/lib/safe-action";

/**
 * Updates the administrative profile and related metadata.
 * Access: Restricted to ADMIN role.
 */
/** @format */
export async function updateProfile(values: ProfileFormValues) {
	const result = await createSecureAction(
		values,
		{
			schema: ProfileSchema,
			accessLevel: [UserRole.SUPER_ADMIN],
		},
		async (data, ctx) => {
			const userId = ctx.user?.id;
			if (!userId) throw new Error("User not found.");

			await prisma.$transaction(async (tx) => {
				// 1. Update Core User Data
				await tx.user.update({
					where: { id: userId },
					data: {
						name: data.name.trim(),
						image: data.image || null,
					},
				});

				// 2. FIXED: Upsert Profile using 'userId' as the unique key
				const profile = await tx.profile.upsert({
					// CHANGE THIS: Search by userId, not profile id
					where: { userId: userId },
					create: {
						userId: userId,
						phone: data?.phone?.trim() || null,
						professionalEmail: data.professionalEmail.trim().toLowerCase(),
						resumeUrl: data.resumeUrl || null,
						translations: {
							create: {
								locale: "en",
								bio: data.bio?.trim() || "",
								location: data.location?.trim() || "",
							},
						},
					},
					update: {
						phone: data.phone?.trim() || null,
						professionalEmail: data.professionalEmail.trim().toLowerCase(),
						resumeUrl: data.resumeUrl || null,
						translations: {
							deleteMany: { locale: "en" },
							create: {
								locale: "en",
								bio: data.bio?.trim() || "",
								location: data.location?.trim() || "",
							},
						},
					},
				});

				// 3. Sync Social Links
				await tx.socialLinks.deleteMany({ where: { profileId: profile.id } });

				if (data.socials && data.socials.length > 0) {
					await tx.socialLinks.createMany({
						data: data.socials.map((s) => ({
							profileId: profile.id,
							name: s.name.trim(),
							url: s.url.trim(),
							icon: s.icon || null,
						})),
					});
				}
			});

			revalidatePath("/admin/users");
			return "Profile synchronized successfully.";
		},
	);

	if (!result.success) return { error: result.error };
	return { success: result.data };
}
/**
 * Changes a user's system role.
 * Access: Restricted to ADMIN. Prevents self-modification.
 */
export async function updateRole(rawInput: unknown) {
	return createSecureAction(
		rawInput,
		{
			schema: z.object({
				targetUserId: z.string().min(1),
				role: z.nativeEnum(UserRole),
			}),
			accessLevel: [UserRole.ADMIN],
		},
		async (data, ctx) => {
			// Security check:ctx.user comes from your session wrapper
			if (data.targetUserId === ctx.user?.id) {
				throw new Error("Self-role modification is prohibited.");
			}

			await prisma.user.update({
				where: { id: data.targetUserId },
				data: { role: data.role },
			});

			revalidatePath("/admin/users");
			return { success: `User role updated to ${data.role}.` };
		},
	);
}

/**
 * Hard deletes a user from the system.
 * Access: Restricted to ADMIN. Prevents self-deletion.
 */
export async function deleteUser(input: unknown) {
	return createSecureAction(
		input,
		{
			schema: z.object({ targetUserId: z.string().min(1) }),
			accessLevel: [UserRole.ADMIN],
		},
		async (data, ctx) => {
			if (data.targetUserId === ctx.user?.id) {
				throw new Error("Self-deletion is prohibited.");
			}

			await prisma.user.delete({
				where: { id: data.targetUserId },
			});

			revalidatePath("/admin/users");
			return { message: "User successfully removed from database." };
		},
	);
}
