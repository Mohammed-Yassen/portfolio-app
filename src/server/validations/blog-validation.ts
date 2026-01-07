/** @format */
import { Locale } from "@prisma/client";
import * as z from "zod";

const NewItemSchema = z.object({
	name: z.string().min(2, "Name is too short"),
});

export const BlogSchema = z.object({
	id: z.string().nullable().optional(),
	slug: z.string().min(3, "Slug is too short").max(100),
	image: z.string().url("Please provide a valid image URL"),
	isPublished: z.boolean().default(false),

	// --- TRANSLATION DATA ---
	locale: z.nativeEnum(Locale),
	title: z.string().min(5, "Title must be at least 5 characters"),
	excerpt: z.string().min(10, "Excerpt is too short"),
	content: z.string().min(20, "Content is too short"),
	metaTitle: z.string().optional().nullable(),
	metaDesc: z.string().optional().nullable(),

	// --- TAXONOMY RELATIONS ---
	categoryIds: z.array(z.string()).optional(), // Selected existing categories
	newCategories: z.array(NewItemSchema).default([]), // New categories to create
	tagIds: z.array(z.string()).default([]), // Selected existing tags
	newTags: z.array(NewItemSchema).default([]), // New tags to create
});

export type BlogFormValues = z.infer<typeof BlogSchema>;
