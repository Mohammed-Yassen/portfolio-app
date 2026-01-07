/** @format */

import * as z from "zod";

import { UserRole, Availability, MessageStatus } from "@prisma/client";

// --- ENUMS (Direct Mappings) ---
export const UserRoleEnum = z.nativeEnum(UserRole);
export const AvailabilityEnum = z.nativeEnum(Availability);
export const MessageStatusEnum = z.nativeEnum(MessageStatus);

export const loginSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
	// Optional: Add 2FA code here if you plan to implement it
	code: z.optional(z.string()),
});

export const registerSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.max(50, "Name is too long"),
		email: z.string().trim().email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Must contain at least one uppercase letter")
			.regex(/[0-9]/, "Must contain at least one number"),
		acceptedTerms: z.boolean(),
	})
	.refine((data) => data.acceptedTerms === true, {
		// 2. Set the error path to the checkbox field
		message: "You must accept the terms and policies",
		path: ["acceptedTerms"],
	});
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
