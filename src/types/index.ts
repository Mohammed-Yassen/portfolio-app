/** @format */
import { HeroSection, HeroTranslation, Locale } from "@prisma/client";

// This represents the structure AFTER your fetch function transforms it
export type HeroData = Omit<HeroSection, "updatedAt"> & {
	updatedAt: Date | string; // Dates often become strings after JSON serialization in Next.js
	content: {
		greeting: string;
		name: string;
		role: string;
		description: string;
		ctaText: string;
		locale: Locale;
	};
};
//
import { AboutSection, AboutStatus, CorePillar } from "@prisma/client";

// Use 'Omit' to take everything from Prisma but exclude metadata we don't want in the UI
// or to handle the Date-to-String conversion for Next.js
export type AboutStatusData = Omit<AboutStatus, "aboutSectionId"> & {
	label: string;
	value: string;
};

export type CorePillarData = Omit<CorePillar, "aboutSectionId"> & {
	title: string;
	description: string;
};

export type AboutData = {
	id: AboutSection["id"];
	updatedAt: Date | string;
	content: {
		title: string;
		subtitle: string | null;
		description: string;
		locale: Locale;
	};
	statuses: AboutStatusData[];
	pillars: CorePillarData[];
};
// types/skills.ts

import { SkillCategory, Skill } from "@prisma/client";

/**
 * The Shape of a single skill after translation mapping
 */
export interface TransformedSkill {
	id: string;
	name: string; // From translations[0].name
	level: number | null;
	icon: string | null;
}

/**
 * The Shape of a category after translation mapping
 * This is exactly what your SkillsForm will receive in initialData
 */
export interface TransformedSkillCategory {
	id: string;
	title: string; // From translations[0].title
	icon: string;
	order: number;
	isActive: boolean;
	skills: TransformedSkill[];
}
/** @format */
//

export interface TransformedTechnique {
	id: string;
	icon: string | null;
	name: string; // From TechniqueTranslation
}

export interface TransformedExperience {
	id: string;
	companyName: string;
	companyLogo: string | null;
	companyWebsite: string | null;
	location: string | null;
	startDate: string; // ISO string
	endDate: string | null;
	isCurrent: boolean;
	updatedAt: string;

	// The specific translation for the active locale
	role: string;
	employmentType: string | null;
	description: string | null;

	// Nested techniques
	techniques: TransformedTechnique[];

	// We keep all translations available for the "Edit" logic
	translations: {
		locale: Locale;
		role: string;
		employmentType: string | null;
		description: string | null;
	}[];
}

export interface TransformedEducation {
	id: string;
	schoolName: string;
	schoolLogo: string | null;
	schoolWebsite: string | null;
	location: string | null;
	startDate: string;
	endDate: string | null;
	isCurrent: boolean;

	// Translation fields
	degree: string;
	fieldOfStudy: string | null;
	description: string | null;

	techniques: TransformedTechnique[];

	translations: {
		locale: Locale;
		degree: string;
		fieldOfStudy: string | null;
		description: string | null;
	}[];
}
