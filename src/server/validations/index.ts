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
