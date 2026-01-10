/** @format */

import * as z from "zod";

// 1. Sub-schemas for better modularity
export const SocialLinkSchema = z.object({
	id: z.string().cuid().optional(),
	name: z.string().min(1, "Title is required").max(50),
	url: z.string().url("Please enter a valid URL"),
	icon: z.string().optional().nullable(),
});
export const UserRoleEnum = z.enum(["ADMIN", "USER", "SUPER_ADMIN"]);

// 2. Main Profile Schema
export const ProfileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format") // E.164 format check
		.optional()
		.nullable()
		.or(z.literal("")),
	professionalEmail: z.string().email("Invalid professional email"),
	resumeUrl: z
		.string()
		.url("Invalid resume URL")
		.optional()
		.nullable()
		.or(z.literal("")),
	role: UserRoleEnum,
	image: z.string().url().optional().nullable().or(z.literal("")),
	profileId: z.string().cuid().optional(),
	locale: z.string().optional().nullable().or(z.literal("")),
	bio: z.string().optional().nullable().or(z.literal("")),
	location: z.string().optional().nullable().or(z.literal("")),

	socials: z.array(SocialLinkSchema).default([]),
});

// 3. Derived Types
export type ProfileFormValues = z.infer<typeof ProfileSchema>;
// /** @format */
// /** @format */
// import * as z from "zod";
// import { User, Profile } from "@prisma/client";

// // --- ENUMS (Direct Mappings) ---

// import { UserRole, Availability, MessageStatus } from "@prisma/client";

// // --- ENUMS (Direct Mappings) ---
// export const UserRoleEnum = z.nativeEnum(UserRole);
// export const AvailabilityEnum = z.nativeEnum(Availability);
// export const MessageStatusEnum = z.nativeEnum(MessageStatus);

// export const loginSchema = z.object({
// 	email: z.string().trim().email("Please enter a valid email address"),
// 	password: z.string().min(1, "Password is required"),
// 	// Optional: Add 2FA code here if you plan to implement it
// 	code: z.optional(z.string()),
// });
// /** @format */

// export const registerSchema = z
// 	.object({
// 		name: z
// 			.string()
// 			.trim()
// 			.min(2, "Name must be at least 2 characters")
// 			.max(50, "Name is too long"),
// 		email: z.string().trim().email("Invalid email address"),
// 		password: z
// 			.string()
// 			.min(8, "Password must be at least 8 characters")
// 			.regex(/[A-Z]/, "Must contain at least one uppercase letter")
// 			.regex(/[0-9]/, "Must contain at least one number"),
// 		acceptedTerms: z.boolean(),
// 	})
// 	.refine((data) => data.acceptedTerms === true, {
// 		// 2. Set the error path to the checkbox field
// 		message: "You must accept the terms and policies",
// 		path: ["acceptedTerms"],
// 	});

// // --- User & Auth Schema ---
// export const userSchema = z.object({
// 	name: z.string().min(2, "Name must be at least 2 characters"),
// 	email: z.string().email("Invalid email address").optional().nullable(),
// 	password: z
// 		.string()
// 		.min(8, "Password must be at least 8 characters")
// 		.optional(),
// 	image: z.string().url("Invalid image URL").optional().nullable(),
// 	emailVerified: z.date().optional().nullable(),
// 	role: z.enum(["USER", "ADMIN"]).default("USER"),
// });

// // --- Profile & Contact Schema ---
// export const profileSchema = z.object({
// 	professionalEmail: z.string().email("Invalid professional email address"),
// 	location: z.string().min(2, "Location is required"),
// 	phone: z
// 		.string()
// 		.min(7, "Phone number is too short")
// 		.max(20, "Phone number is too long")
// 		.regex(
// 			/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
// 			"Invalid phone format",
// 		)
// 		.optional(),
// 	availability: AvailabilityEnum.default("AVAILABLE"),
// });

// export const socialLinkSchema = z.object({
// 	name: z.string().min(1, "Platform name is required"),
// 	url: z.string().url("Invalid URL format"),
// 	icon: z.string().optional(),
// });

// export const IdentitySchema = z.object({
// 	// User Fields
// 	name: z.string().min(2, "Name is required"),
// 	image: z.string().url().optional().nullable().or(z.literal("")),

// 	// Profile Fields
// 	professionalEmail: z.string().email("Invalid email address"),
// 	location: z.string().min(2, "Location is too short"),
// 	phone: z
// 		.string()
// 		.min(7, "Invalid phone number")
// 		.optional()
// 		.nullable()
// 		.or(z.literal("")),
// 	availability: AvailabilityEnum.default("AVAILABLE"),
// });

// export type IdentityValues = z.infer<typeof IdentitySchema>;
// // --- Inferred Types ---
// export type SocialLinkValues = z.infer<typeof socialLinkSchema>;
// export type UserValues = z.infer<typeof userSchema>;
// export type ProfileValues = z.infer<typeof profileSchema>;

// export const testimonialSchema = z.object({
// 	clientName: z.string().min(2, "Name is required"),
// 	clientTitle: z.string().min(2, "Title is required (e.g., Founder)"),
// 	role: z
// 		.string()
// 		.min(2, "Role is required (e.g., CEO at TechCorp)")
// 		.optional(),
// 	content: z.string().min(10, "Please share a bit more about your experience"),
// 	rating: z.number().min(1).max(5).default(5),
// 	email: z.string().email("Invalid email").optional().or(z.literal("")),
// 	avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
// 	linkedinUrl: z
// 		.string()
// 		.url("Invalid LinkedIn URL")
// 		.optional()
// 		.or(z.literal("")),
// });

// export const contactMessageSchema = z.object({
// 	name: z.string().min(1, "Name required"),
// 	email: z.string().email("Invalid email"),
// 	subject: z.string().optional().nullable(),
// 	message: z.string().min(10, "Message is too short"),
// 	status: MessageStatusEnum.default("UNREAD"),
// });

// export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
// export type ContactMessageValues = z.infer<typeof contactMessageSchema>;
// // // --- TYPE INFERENCE ---
// // // This allows you to use: useForm<LoginFormValues> instead of z.infer every time.

// // // --- 2. PROFILE & SOCIALS ---
// // export const contactMeSchema = z.object({
// // 	githubUrl: z.string().url().or(z.literal("")).nullable(),
// // 	linkedinUrl: z.string().url().or(z.literal("")).nullable(),
// // 	xUrl: z.string().url().or(z.literal("")).nullable(),
// // 	whatsapp: z.string().optional().nullable(),
// // 	figma: z.string().url().or(z.literal("")).nullable(),
// // });

// // export const profileSchema = z.object({
// // 	professionalEmail: z.string().email().default("contact@example.com"),
// // 	location: z.string().min(2).default("Remote / Yemen"),
// // 	availability: AvailabilityEnum.default("AVAILABLE"),
// // });

// // // --- 3. MESSAGES & TESTIMONIALS ---
// // export const contactMessageSchema = z.object({
// // 	name: z.string().min(2, "Name is required"),
// // 	email: z.string().email("Invalid email"),
// // 	subject: z.string().optional().nullable(),
// // 	message: z.string().min(10, "Message must be at least 10 characters"),
// // 	status: MessageStatusEnum.default("UNREAD"),
// // });

// // export const testimonialSchema = z.object({
// // 	clientName: z.string().min(2, "Client name is required"),
// // 	clientTitle: z.string().min(2, "Client role/title is required"),
// // 	content: z.string().min(10, "Testimonial content is too short").max(1000),
// // 	avatarUrl: z.string().url().optional().nullable(),
// // 	linkedinUrl: z.string().url().optional().nullable(),
// // 	isFeatured: z.boolean().default(false),
// // 	isActive: z.boolean().default(false),
// // });

// // // --- 4. UI STATE (Section Toggles) ---
// // export const sectionActiveSchema = z.object({
// // 	heroActive: z.boolean().default(true),
// // 	aboutActive: z.boolean().default(true),
// // 	projectActive: z.boolean().default(true),
// // 	blogActive: z.boolean().default(true),
// // 	skillActive: z.boolean().default(true),
// // 	certificationActive: z.boolean().default(true),
// // 	experienceActive: z.boolean().default(true),
// // 	educationActive: z.boolean().default(true),
// // 	contactActive: z.boolean().default(true),
// // 	testiActive: z.boolean().default(true),
// // });

// // // --- 5. EXPORTED TYPES ---
// // export type FullProfile = Profile & {
// // 	user: User;
// // 	socials: ContactMe | null;
// // };

// // export type LoginFormValues = z.infer<typeof loginSchema>;
// // export type RegisterFormValues = z.infer<typeof registerSchema>;
// // export type ProfileFormValues = z.infer<typeof profileSchema>;
// // export type ContactMeFormValues = z.infer<typeof contactMeSchema>;
// // export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
// // export type ContactMessageValues = z.infer<typeof contactMessageSchema>;
// // export type SectionActiveValues = z.infer<typeof sectionActiveSchema>;
