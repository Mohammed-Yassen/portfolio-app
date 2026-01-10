/** @format */
import { z } from "zod";
import { Availability, Locale } from "@prisma/client";

export const heroSchema = z.object({
	id: z.string().optional().nullable(),
	primaryImage: z.string().min(1, "Image is required"),
	// Remove .default() here if you want strict typing in the Resolver
	isActive: z.boolean(),
	availability: z.nativeEnum(Availability),
	locale: z.nativeEnum(Locale),
	greeting: z.string().min(1, "Greeting is required"),
	name: z.string().min(1, "Name is required"),
	role: z.string().min(1, "Role is required"),
	description: z.string().min(1, "Description is required"),
	ctaText: z.string().min(1, "CTA is required"),
	// Keep optional only for truly nullable fields
	resumeUrl: z.string().optional().nullable(),
});

export type HeroFormValues = z.infer<typeof heroSchema>;

//  about schema

// --- 1. About Status Schema ---
export const aboutStatusSchema = z.object({
	id: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	isActive: z.boolean(),
	// Localized content
	locale: z.nativeEnum(Locale),
	label: z.string().min(1, "Label is required"),
	value: z.string().min(1, "Value is required"),
});

// --- 2. Core Pillar Schema ---
export const corePillarSchema = z.object({
	id: z.string().optional().nullable(),
	icon: z.string().min(1, "Icon is required"),
	// Localized content
	locale: z.nativeEnum(Locale),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
});

// --- 3. Main About Section Schema ---
export const aboutSchema = z.object({
	id: z.string().optional().nullable(),
	locale: z.nativeEnum(Locale),
	title: z.string().min(1, "Title is required"),
	subtitle: z.string().optional().nullable(),
	description: z.string().min(1, "Description is required"),

	// CHANGE: Remove .optional() and add .default([])
	// This makes the TypeScript type an array instead of "array | undefined"
	corePillars: z.array(corePillarSchema),
	statuses: z.array(aboutStatusSchema),
});
// --- Types ---
export type AboutStatusFormValues = z.infer<typeof aboutStatusSchema>;
export type CorePillarFormValues = z.infer<typeof corePillarSchema>;
export type AboutFormValues = z.infer<typeof aboutSchema>;

// @/server/validations.ts

export const skillSchema = z.object({
	id: z.string().optional().nullable(),
	name: z.string().min(1, "Skill name is required"),
	level: z.coerce.number().min(0).max(100).default(80),
	icon: z.string().optional().nullable(),
});

export const skillCategorySchema = z.object({
	id: z.string().optional().nullable(),
	icon: z.string().min(1, "Category icon is required"),
	title: z.string().min(1, "Category title is required"),
	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
	locale: z.nativeEnum(Locale),
	skills: z.array(skillSchema).default([]),
});

export type SkillCategoryFormValue = z.infer<typeof skillCategorySchema>;

export const techniqueSchema = z.object({
	id: z.string().optional().nullable(),
	name: z.string().min(1, "Technique name is required"),
	icon: z.string().optional().nullable(),
});

// Experience Schema (Matches "skillCategorySchema" logic)
export const experienceSchema = z.object({
	id: z.string().optional().nullable(),
	companyName: z.string().min(1, "Company name is required"),
	companyLogo: z.string().optional().nullable(),
	companyWebsite: z.string().url().or(z.literal("")).optional().nullable(),
	location: z.string().optional().nullable(),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().optional().nullable(),
	isCurrent: z.boolean().default(false),

	// Translation data
	locale: z.nativeEnum(Locale),
	role: z.string().min(1, "Role title is required"),
	employmentType: z.string().optional().nullable(),
	description: z.string().optional().nullable(),

	// Nested techniques array
	techniques: z.array(techniqueSchema).default([]),
});

export type ExperienceFormValue = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
	id: z.string().nullable().optional(),
	schoolName: z.string().min(2, "School name is required"),
	schoolLogo: z.string().optional(),
	schoolWebsite: z.string().url().or(z.literal("")).optional(),
	location: z.string().optional(),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().optional(),
	isCurrent: z.boolean().default(false),

	// Localized fields
	locale: z.nativeEnum(Locale),
	degree: z.string().min(2, "Degree name is required"),
	fieldOfStudy: z.string().optional(),
	description: z.string().optional(),

	techniques: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string(),
				icon: z.string().optional(),
			}),
		)
		.default([]),
});

export type EducationFormValue = z.infer<typeof educationSchema>;

//

/**
 * --- Section Activation Schema ---
 * Controls the visibility of every major component on the portfolio.
 * Matches the Prisma 'SectionActive' model.
 */
export const sectionActiveSchema = z.object({
	navActive: z.boolean().default(true),
	footerActive: z.boolean().default(true),
	heroActive: z.boolean().default(true),
	aboutActive: z.boolean().default(true),
	skillActive: z.boolean().default(true),
	serviceActive: z.boolean().default(true),
	projectActive: z.boolean().default(true),
	experienceActive: z.boolean().default(true),
	educationActive: z.boolean().default(true),
	certificationActive: z.boolean().default(true),
	blogActive: z.boolean().default(true),
	testiActive: z.boolean().default(true),
	contactActive: z.boolean().default(true),
});

/**
 * --- Site Configuration Schema ---
 * Controls global metadata and site-wide strings.
 */
export const siteConfigSchema = z.object({
	siteName: z
		.string()
		.min(2, "Site name must be at least 2 characters")
		.default("DevPortfolio"),
	footerText: z.string().min(1, "Footer text cannot be empty"),
	profileViews: z.number().int().default(0),
	enableBlog: z.boolean().default(true),
	metaDescription: z
		.string()
		.max(160, "Description should be under 160 characters")
		.optional()
		.nullable(),
});

// --- Inferred TypeScript Types ---

/**
 * Represents the boolean state of all portfolio sections.
 * Use this in your SectionActivationClient component props.
 */
export type SectionActiveValues = z.infer<typeof sectionActiveSchema>;

/**
 * Represents the global site settings.
 * Use this for the SiteConfig form components.
 */
export type SiteConfigValues = z.infer<typeof siteConfigSchema>;

export const certificationSchema = z.object({
	id: z.string().optional().nullable(),
	issuer: z.string().min(1, "Issuer is required"),
	coverUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
	link: z.string().url("Invalid URL").optional().or(z.literal("")),
	issueDate: z.string().min(1, "Issue date is required"),
	expireDate: z.string().optional().nullable(),
	credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
	isActive: z.boolean(),

	// Translation data
	locale: z.nativeEnum(Locale),
	title: z.string().min(1, "Title is required"),
	credentialId: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
});

export type CertificationFormValue = z.infer<typeof certificationSchema>;

export const socialLinkSchema = z.object({
	id: z.string().optional().nullable(),
	name: z.string().min(1, "Platform name is required"),
	url: z.string().url("Invalid URL for social link"),
	icon: z.string().optional().nullable(),
	profileId: z.string().optional().nullable(), // Optional if handled by the action
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;
