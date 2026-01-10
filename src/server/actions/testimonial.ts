/** @format */
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
	testimonialSchema,
	TestimonialFormValues,
} from "@/server/validations/testimonial";
import { Testimonial } from "@prisma/client";

/**
 * Type-safe response wrapper
 */
type ActionResponse<T = undefined> = {
	success?: string;
	error?: string;
	data?: T;
};

/**
 * PRIVATE UTILITY: Centralized Admin Check
 */
async function validateAdmin() {
	const session = await auth();
	const isAdmin = true;
	// session?.user?.role === "ADMIN" ||
	// session?.user?.email === process.env.ADMIN_EMAIL;

	if (!session || !isAdmin) {
		throw new Error("UNAUTHORIZED");
	}
	return session;
}

/**
 * PUBLIC: Create Testimonial (Client Submission)
 */
export async function createTestimonialAction(
	values: TestimonialFormValues,
): Promise<ActionResponse<Testimonial>> {
	try {
		const session = await auth();
		if (!session?.user?.email) return { error: "AUTH_REQUIRED" };

		const validatedFields = testimonialSchema.safeParse(values);
		if (!validatedFields.success) return { error: "INVALID_FIELDS" };

		const newTestimonial = await prisma.testimonial.create({
			data: {
				...validatedFields.data,
				email: session.user.email,
				avatarUrl: session.user.image,
				isActive: false, // Moderation queue by default
				isFeatured: false,
				status: "PENDING",
			},
		});

		revalidatePath("/", "layout");
		return { success: "SUBMITTED_FOR_REVIEW", data: newTestimonial };
	} catch (error) {
		console.error("CREATE_TESTIMONIAL_ERROR:", error);
		return { error: "DATABASE_ERROR" };
	}
}

/**
 * ADMIN: Toggle Status (Active or Featured)
 */
export async function updateTestimonialStatus(
	id: string,
	payload: { isActive?: boolean; isFeatured?: boolean },
): Promise<ActionResponse<Testimonial>> {
	try {
		await validateAdmin();

		const updated = await prisma.testimonial.update({
			where: { id },
			data: {
				...(payload.isActive !== undefined && {
					isActive: payload.isActive,
					status: payload.isActive ? "APPROVED" : "PENDING",
				}),
				...(payload.isFeatured !== undefined && {
					isFeatured: payload.isFeatured,
				}),
			},
		});

		revalidatePath("/admin/testimonials", "page");
		revalidatePath("/", "layout");

		return { success: "UPDATE_SUCCESS", data: updated };
	} catch (error) {
		console.error("UPDATE_STATUS_ERROR:", error);
		return { error: "UPDATE_FAILED" };
	}
}

/**
 * ADMIN: Single Delete
 */
export async function deleteTestimonial(id: string): Promise<ActionResponse> {
	try {
		await validateAdmin();

		await prisma.testimonial.delete({
			where: { id },
		});

		revalidatePath("/admin/testimonials", "page");
		revalidatePath("/", "layout");

		return { success: "DELETE_SUCCESS" };
	} catch (error) {
		console.error("DELETE_ERROR:", error);
		return { error: "DELETE_FAILED" };
	}
}

/**
 * ADMIN: Bulk Actions
 */
export async function bulkDeleteAction(ids: string[]): Promise<ActionResponse> {
	try {
		await validateAdmin();
		await prisma.testimonial.deleteMany({
			where: { id: { in: ids } },
		});

		revalidatePath("/admin/testimonials", "page");
		revalidatePath("/", "layout");

		return { success: "BULK_DELETE_SUCCESS" };
	} catch (error) {
		console.error("BULK_DELETE_ERROR:", error);
		return { error: "BULK_ACTION_FAILED" };
	}
}
