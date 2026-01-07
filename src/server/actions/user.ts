/** @format */

// /** @format */
// "use server";

// import { db } from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import {
// 	profileSchema,
// 	userSchema,
// 	socialLinkSchema,
// 	IdentityValues,
// 	IdentitySchema,
// } from "@/lib/validations/user";
// import z from "zod";

// /** --- IDENTITY & ACCOUNT (USER + PROFILE) --- */
// /** @format */
// // actions/user.ts

// /** @format */

// export async function updateIdentity(userId: string, values: IdentityValues) {
// 	try {
// 		// 1. Validate against the schema
// 		const validated = IdentitySchema.safeParse(values);

// 		if (!validated.success) {
// 			console.error("❌ Zod Error:", validated.error.flatten().fieldErrors);
// 			return { error: "Check your inputs. Some fields are invalid." };
// 		}

// 		const { name, image, ...profileData } = validated.data;

// 		// 2. Perform Transaction
// 		await db.$transaction(async (tx) => {
// 			// Update User
// 			await tx.user.update({
// 				where: { id: userId },
// 				data: {
// 					name,
// 					image: image || null,
// 				},
// 			});

// 			// Update or Create Profile
// 			// We use the userId to find the profile, but set the ID to "owner-static" if creating
// 			await tx.profile.upsert({
// 				where: { userId: userId },
// 				update: {
// 					professionalEmail: profileData.professionalEmail,
// 					location: profileData.location || null,
// 					phone: profileData.phone || null,
// 					availability: profileData.availability,
// 				},
// 				create: {
// 					id: "owner-static", // Match your schema's default ID
// 					userId: userId,
// 					professionalEmail: profileData.professionalEmail,
// 					location: profileData.location || "Remote / Yemen",
// 					phone: profileData.phone || null,
// 					availability: profileData.availability,
// 				},
// 			});
// 		});

// 		revalidatePath("/admin/settings");
// 		return { success: "Identity and Profile synced!" };
// 	} catch (error: any) {
// 		console.error("Prisma Error:", error.message);
// 		return { error: "Database transaction failed." };
// 	}
// }
// /** --- SOCIAL LINKS (CRUD) --- */
// export async function createSocialLink(
// 	values: z.infer<typeof socialLinkSchema>,
// ) {
// 	const validated = socialLinkSchema.safeParse(values);
// 	if (!validated.success) return { error: "Invalid input" };

// 	try {
// 		const link = await db.socialLinks.create({
// 			data: { ...validated.data, profileId: "owner-static" },
// 		});
// 		revalidatePath("/admin/settings");
// 		return { success: "Platform added!", data: link };
// 	} catch (error) {
// 		return { error: "Creation failed" };
// 	}
// }

// export async function updateSocialLink(
// 	id: string,
// 	values: z.infer<typeof socialLinkSchema>,
// ) {
// 	const validated = socialLinkSchema.safeParse(values);
// 	if (!validated.success) return { error: "Invalid input" };

// 	try {
// 		await db.socialLinks.update({ where: { id }, data: validated.data });
// 		revalidatePath("/admin/settings");
// 		return { success: "Platform updated!" };
// 	} catch (error) {
// 		return { error: "Update failed" };
// 	}
// }

// export async function deleteSocialLink(id: string) {
// 	try {
// 		await db.socialLinks.delete({ where: { id } });
// 		revalidatePath("/admin/settings");
// 		return { success: "Platform removed" };
// 	} catch (error) {
// 		return { error: "Delete failed" };
// 	}
// }
