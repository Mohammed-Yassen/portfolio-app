/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { testimonialSchema } from "@/server/validations/testimonial";
import { z } from "zod";
import { createSecureAction } from "@/lib/safe-action";

/**
 * PUBLIC: Create Testimonial
 * Access: Any AUTHENTICATED user can submit.
 */
export async function createTestimonialAction(values: unknown) {
	const result = await createSecureAction(
		values,
		{
			schema: testimonialSchema,
			accessLevel: "AUTHENTICATED", // Use your wrapper's built-in auth check
		},
		async (data, ctx) => {
			// ctx.user is guaranteed to exist here due to AUTHENTICATED level
			const newTestimonial = await prisma.testimonial.create({
				data: {
					...data,
					email: ctx.user?.email,
					avatarUrl: ctx.user?.image,
					isActive: false, // Pending moderation
					isFeatured: false,
					status: "PENDING",
				},
			});

			revalidatePath("/", "layout");
			return {
				message: "Submitted for review!",
				data: newTestimonial,
			};
		},
	);

	if (!result.success) return { error: result.error };
	return { success: result.data.message, data: result.data.data };
}

/**
 * ADMIN: Update Status (Approve/Feature)
 * Access: Restricted to ADMIN and SUPER_ADMIN.
 */
export async function updateTestimonialStatus(input: unknown) {
	const result = await createSecureAction(
		input,
		{
			schema: z.object({
				id: z.string().min(1),
				isActive: z.boolean().optional(),
				isFeatured: z.boolean().optional(),
			}),
			accessLevel: [UserRole.OWNER, UserRole.SUPER_ADMIN],
		},
		async (data) => {
			const updated = await prisma.testimonial.update({
				where: { id: data.id },
				data: {
					...(data.isActive !== undefined && {
						isActive: data.isActive,
						status: data.isActive ? "APPROVED" : "PENDING",
					}),
					...(data.isFeatured !== undefined && {
						isFeatured: data.isFeatured,
					}),
				},
			});

			revalidatePath("/admin/testimonials");
			revalidatePath("/");
			return updated;
		},
	);

	if (!result.success) return { error: result.error };
	return { success: "Update successful", data: result.data };
}

/**
 * ADMIN: Delete Testimonial
 */
export async function deleteTestimonial(input: unknown) {
	const result = await createSecureAction(
		input,
		{
			schema: z.object({ id: z.string().min(1) }),
			accessLevel: [UserRole.OWNER, UserRole.SUPER_ADMIN],
		},
		async (data) => {
			await prisma.testimonial.delete({ where: { id: data.id } });
			revalidatePath("/admin/testimonials");
			return true;
		},
	);

	if (!result.success) return { error: result.error };
	return { success: "Testimonial deleted" };
}
/**
 * ADMIN: Bulk Delete Actions
 */
export async function bulkDeleteAction(input: unknown) {
	const result = await createSecureAction(
		input,
		{
			schema: z.object({ ids: z.array(z.string()) }),
			accessLevel: [UserRole.OWNER, UserRole.SUPER_ADMIN],
		},
		async (data) => {
			await prisma.testimonial.deleteMany({
				where: { id: { in: data.ids } },
			});

			revalidatePath("/admin/testimonials", "page");
			revalidatePath("/", "layout");
			return true;
		},
	);

	if (!result.success) return { error: result.error };
	return { success: "Selected testimonials deleted" };
}
// /** @format */
// "use server";

// import { revalidatePath } from "next/cache";
// import { auth } from "@/auth";
// import prisma from "@/lib/prisma";
// import {
// 	testimonialSchema,
// 	TestimonialFormValues,
// } from "@/server/validations/testimonial";
// import { Testimonial } from "@prisma/client";

// /**
//  * Type-safe response wrapper
//  */
// type ActionResponse<T = undefined> = {
// 	success?: string;
// 	error?: string;
// 	data?: T;
// };

// /**
//  * PRIVATE UTILITY: Centralized Admin Check
//  */
// async function validateAdmin() {
// 	const session = await auth();
// 	const isAdmin = true;
// 	// session?.user?.role === "ADMIN" ||
// 	// session?.user?.email === process.env.ADMIN_EMAIL;

// 	if (!session || !isAdmin) {
// 		throw new Error("UNAUTHORIZED");
// 	}
// 	return session;
// }

// /**
//  * PUBLIC: Create Testimonial (Client Submission)
//  */
// export async function createTestimonialAction(
// 	values: TestimonialFormValues,
// ): Promise<ActionResponse<Testimonial>> {
// 	try {
// 		const session = await auth();
// 		if (!session?.user?.email) return { error: "AUTH_REQUIRED" };

// 		const validatedFields = testimonialSchema.safeParse(values);
// 		if (!validatedFields.success) return { error: "INVALID_FIELDS" };

// 		const newTestimonial = await prisma.testimonial.create({
// 			data: {
// 				...validatedFields.data,
// 				email: session.user.email,
// 				avatarUrl: session.user.image,
// 				isActive: false, // Moderation queue by default
// 				isFeatured: false,
// 				status: "PENDING",
// 			},
// 		});

// 		revalidatePath("/", "layout");
// 		return { success: "SUBMITTED_FOR_REVIEW", data: newTestimonial };
// 	} catch (error) {
// 		console.error("CREATE_TESTIMONIAL_ERROR:", error);
// 		return { error: "DATABASE_ERROR" };
// 	}
// }

// /**
//  * ADMIN: Toggle Status (Active or Featured)
//  */
// export async function updateTestimonialStatus(
// 	id: string,
// 	payload: { isActive?: boolean; isFeatured?: boolean },
// ): Promise<ActionResponse<Testimonial>> {
// 	try {
// 		await validateAdmin();

// 		const updated = await prisma.testimonial.update({
// 			where: { id },
// 			data: {
// 				...(payload.isActive !== undefined && {
// 					isActive: payload.isActive,
// 					status: payload.isActive ? "APPROVED" : "PENDING",
// 				}),
// 				...(payload.isFeatured !== undefined && {
// 					isFeatured: payload.isFeatured,
// 				}),
// 			},
// 		});

// 		revalidatePath("/admin/testimonials", "page");
// 		revalidatePath("/", "layout");

// 		return { success: "UPDATE_SUCCESS", data: updated };
// 	} catch (error) {
// 		console.error("UPDATE_STATUS_ERROR:", error);
// 		return { error: "UPDATE_FAILED" };
// 	}
// }

// /**
//  * ADMIN: Single Delete
//  */
// export async function deleteTestimonial(id: string): Promise<ActionResponse> {
// 	try {
// 		await validateAdmin();

// 		await prisma.testimonial.delete({
// 			where: { id },
// 		});

// 		revalidatePath("/admin/testimonials", "page");
// 		revalidatePath("/", "layout");

// 		return { success: "DELETE_SUCCESS" };
// 	} catch (error) {
// 		console.error("DELETE_ERROR:", error);
// 		return { error: "DELETE_FAILED" };
// 	}
// }

// /**
//  * ADMIN: Bulk Actions
//  */
// export async function bulkDeleteAction(ids: string[]): Promise<ActionResponse> {
// 	try {
// 		await validateAdmin();
// 		await prisma.testimonial.deleteMany({
// 			where: { id: { in: ids } },
// 		});

// 		revalidatePath("/admin/testimonials", "page");
// 		revalidatePath("/", "layout");

// 		return { success: "BULK_DELETE_SUCCESS" };
// 	} catch (error) {
// 		console.error("BULK_DELETE_ERROR:", error);
// 		return { error: "BULK_ACTION_FAILED" };
// 	}
// }
