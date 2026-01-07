/** @format */
import { ProjectCategory, Locale } from "@prisma/client";

/**
 * Represents a tag linked to a project.
 * Usually a flat structure as tags often aren't localized.
 */
export interface TransformedTag {
	id: string;
	name: string;
}

/**
 * Represents a technique/technology used in a project.
 * Techniques often have their own translations (e.g., "Software Architecture" vs "Arquitectura de Software")
 */
export interface TransformedTechnique {
	id: string;
	name: string; // Flattened from TechniqueTranslation
	icon: string | null;
}

/**
 * The core Project interface.
 * This represents the "Final" object sent to the UI after merging
 * the base Project table with the ProjectTranslation table for a specific locale.
 */
export interface TransformedProject {
	// 1. Primary Identifiers & Metadata
	id: string;
	slug: string;
	category: ProjectCategory;
	createdAt: Date | string; // Dates often come as strings from Server Actions
	updatedAt: Date | string;

	// 2. Media Assets
	mainImage: string;
	gallery: string[];

	// 3. Flags & Configuration
	isFeatured: boolean;
	isActive: boolean;

	// 4. External Links (Using optional chaining/nullish logic)
	liveUrl: string | null;
	repoUrl: string | null;

	// 5. Localized Content (Flattened from ProjectTranslation)
	// These are required because a "Transformed" project assumes
	// the translation for the current locale exists.
	title: string;
	description: string;
	content: string | null;

	// 6. Meta-info for SEO or UI logic
	locale: Locale;

	// 7. Relations (Many-to-Many)
	tags: TransformedTag[];
	techniques: TransformedTechnique[];
}
