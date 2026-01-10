/** @format */

import * as z from "zod";

// Match your Prisma Enum exactly for type safety
export const TestimonialStatusEnum = z.enum([
	"PENDING",
	"APPROVED",
	"REJECTED",
	"ARCHIVED",
	"STAR",
]);

export const testimonialSchema = z.object({
	clientName: z.string().min(2, "Name must be at least 2 characters"),
	clientTitle: z.string().min(2, "Title or Company is required"),
	email: z.string().email("Invalid email address").optional().or(z.literal("")),
	status: TestimonialStatusEnum.optional().default("PENDING"),
	role: z.string().optional().nullable(),
	content: z.string().min(10, "Content must be at least 10 characters"),
	rating: z.number().min(1).max(5).default(5),
	avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
	linkedinUrl: z
		.string()
		.url("Invalid LinkedIn URL")
		.optional()
		.or(z.literal("")),
	githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
	isFeatured: z.boolean().default(false),
	isActive: z.boolean().default(false),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
