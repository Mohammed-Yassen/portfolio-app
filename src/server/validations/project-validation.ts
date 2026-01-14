/** @format */

import { Locale, ProjectCategory } from "@prisma/client";
import * as z from "zod";

// Helper for creating new items on the fly
const NewItemSchema = z.object({
	name: z.string().min(2, "Name is too short"),
	icon: z.string().optional(), // Mainly for Techniques
});

export const ProjectSchema = z
	.object({
		// --- CORE PROJECT DATA ---
		id: z.string().nullable().optional(),
		slug: z.string().min(3, "Slug must be at least 3 characters").max(50),
		mainImage: z.string().url("Main image must be a valid URL"),
		gallery: z.array(z.string().url()).default([]),
		category: z.nativeEnum(ProjectCategory),
		liveUrl: z.string().url().optional().or(z.literal("")).nullable(),
		repoUrl: z.string().url().optional().or(z.literal("")).nullable(),
		isFeatured: z.boolean().default(false),
		isActive: z.boolean().default(true),

		// --- TRANSLATION DATA (For current locale) ---
		locale: z.nativeEnum(Locale),
		title: z.string().min(5, "Title is too short"),
		description: z.string().min(10, "Description is too short"),
		content: z.string().optional(),

		// --- RELATIONS: TAGS ---
		// Select existing tag IDs
		tagIds: z.array(z.string()).default([]),
		// Add new tags that don't exist in DB yet
		newTags: z.array(NewItemSchema).default([]),

		// --- RELATIONS: TECHNIQUES ---
		// Select existing technique IDs
		techniqueIds: z.array(z.string()).default([]),
		// Add new techniques on the fly
		newTechniques: z.array(NewItemSchema).default([]),
	})
	.refine((data) => data.tagIds.length + data.newTags.length > 0, {
		message: "Select at least one existing tag or add a new one",
		path: ["tagIds"],
	})
	.refine((data) => data.techniqueIds.length + data.newTechniques.length > 0, {
		message: "Select at least one technique or add a new one",
		path: ["techniqueIds"],
	});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
