/** @format */

import prisma from "@/lib/prisma";

/**
 * PUBLIC: Get All Active Testimonials
 * Optimized for the frontend with specific field selection
 */
export async function getPublicTestimonials() {
	try {
		return await prisma.testimonial.findMany({
			where: {
				isActive: true,
				status: { in: ["APPROVED", "STAR"] },
			},
			select: {
				id: true,
				clientName: true,
				clientTitle: true,
				role: true,
				content: true,
				rating: true,
				avatarUrl: true,
				linkedinUrl: true,
				isFeatured: true,
			},
			orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
		});
	} catch (error) {
		return [];
	}
}
/** @format */

import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

/**
 * ADMIN: Get All Testimonials (Unfiltered)
 * Returns all records including drafts, rejected, and archived items.
 */
export async function getAllTestimonialsAdmin() {
	try {
		// 1. Security Check: Only admins should call this
		const session = await auth();
		const isAdmin = session?.user?.role === "USER";

		if (!isAdmin) {
			return {
				success: false,
				error: "Unauthorized: Admin access required.",
			};
		}

		// 2. Fetch all records
		const testimonials = await prisma.testimonial.findMany({
			orderBy: {
				createdAt: "desc",
			},
			// We don't use 'select' here because admin needs to see EVERY field
			// for editing purposes (email, linkedinUrl, status, etc.)
		});

		return {
			success: true,
			data: testimonials,
		};
	} catch (error) {
		console.error("[GET_ALL_TESTIMONIALS_ERROR]:", error);
		return {
			success: false,
			error: "Failed to fetch testimonials from database.",
		};
	}
}

/**
 * Public Testimonial Type
 * Automatically matches the 'select' fields in getPublicTestimonials
 */
export type Testimonial = Prisma.PromiseReturnType<
	typeof getPublicTestimonials
>[number];

/**
 * Admin Testimonial Type
 * Includes all fields (email, status, createdAt, etc.)
 */
export type AdminTestimonial = NonNullable<
	Prisma.PromiseReturnType<typeof getAllTestimonialsAdmin>["data"]
>[number];
