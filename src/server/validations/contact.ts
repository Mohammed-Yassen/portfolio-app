/** @format */
import z from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email().trim().toLowerCase(),
	subject: z.string().max(150).optional().or(z.literal("")),
	message: z.string().min(10).max(5000),
});

// Added REPLIED and SPAM to the enum
export const contactMessageSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	// Change .optional() to .nullable() here:
	subject: z.string().nullable(),
	message: z.string(),
	status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED", "SPAM"]),
	priority: z.boolean(),
	// Ensure this matches Prisma too:
	ipAddress: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const contactQuerySchema = z.object({
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(10),
	status: z.enum(["UNREAD", "READ", "REPLIED", "ARCHIVED", "SPAM"]).optional(),
	priority: z.boolean().optional(),
});
// src/server/validations/contact.ts

export const manageMessageSchema = z.object({
	id: z.string().min(1),
	action: z.enum([
		"ARCHIVE",
		"DELETE",
		"TOGGLE_STAR",
		"REPLIED",
		"TOGGLE_READ",
		"SPAM",
	]),
});

export type MessageAction = z.infer<typeof manageMessageSchema>["action"];
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactMessageValues = z.infer<typeof contactMessageSchema>;
export type ContactQuery = z.infer<typeof contactQuerySchema>;
