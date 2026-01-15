/** @format */
import prisma from "@/lib/prisma";
import { Locale } from "@prisma/client";
import { unstable_cache } from "next/cache";
/** @format */

import {
	AboutData,
	TransformedSkillCategory,
	TransformedExperience,
	TransformedEducation,
	TransformedCertification,
} from "@/types";

/**
 * HERO SECTION

/**
 * ABOUT SECTION
 */
export const getAboutData = unstable_cache(
	async (locale: Locale): Promise<AboutData | null> => {
		const about = await prisma.aboutSection.findFirst({
			include: {
				translations: { where: { locale } },
				statuses: {
					include: { translations: { where: { locale } } },
					orderBy: { id: "asc" },
				},
				corePillars: {
					include: { translations: { where: { locale } } },
					orderBy: { id: "asc" },
				},
			},
		});

		if (!about) return null;
		const main = about.translations[0];

		return {
			id: about.id,
			updatedAt: about.updatedAt,
			content: {
				title: main?.title ?? "",
				subtitle: main?.subtitle ?? "",
				description: main?.description ?? "",
				locale,
			},
			statuses: about.statuses.map((s) => ({
				id: s.id,
				icon: s.icon ?? "",
				isActive: s.isActive,
				label: s.translations[0]?.label ?? "",
				value: s.translations[0]?.value ?? "",
				locale,
			})),
			pillars: about.corePillars.map((p) => ({
				id: p.id,
				icon: p.icon,
				title: p.translations[0]?.title ?? "",
				description: p.translations[0]?.description ?? "",
				locale,
			})),
		};
	},
	["about-data"],
	{ revalidate: 3600, tags: ["about"] },
);

/** @format */

// Helper for consistent keys and tags
const CACHE_TAGS = {
	HERO: "hero",
	ABOUT: "about",
	SKILLS: "skills",
	EXPERIENCE: "experience",
} as const;

export const getHeroData = unstable_cache(
	async (locale: Locale) => {
		const hero = await prisma.heroSection.findFirst({
			include: { translations: { where: { locale } } },
			orderBy: { updatedAt: "desc" },
		});

		if (!hero) return null;
		const translation = hero.translations[0];

		return {
			...hero,
			content: {
				greeting: translation?.greeting ?? "",
				name: translation?.name ?? "",
				role: translation?.role ?? "",
				description: translation?.description ?? "",
				ctaText: translation?.ctaText ?? "",
				resumeUrl: translation?.resumeUrl ?? "",
				locale,
			},
		};
	},
	["hero-cache"], // Key
	{ revalidate: 3600, tags: [CACHE_TAGS.HERO] }, // Tag
);

export const getSkills = unstable_cache(
	async (locale: Locale) => {
		const categories = await prisma.skillCategory.findMany({
			orderBy: { order: "asc" },
			include: {
				translations: { where: { locale: { in: [locale, "en"] } } },
				skills: {
					include: {
						translations: { where: { locale: { in: [locale, "en"] } } },
					},
				},
			},
		});

		return categories.map((cat) => {
			const trans =
				cat.translations.find((t) => t.locale === locale) ||
				cat.translations[0];
			return {
				...cat,
				title: trans?.title || "Untitled",
				skills: cat.skills.map((s) => ({
					...s,
					name:
						s.translations.find((t) => t.locale === locale)?.name ||
						s.translations[0]?.name ||
						"Skill",
				})),
			};
		});
	},
	["skills-cache"],
	{ revalidate: 3600, tags: [CACHE_TAGS.SKILLS] },
);

/**
 * EXPERIENCES
 * Fetches professional history with locale fallback logic.
 */
export const getExperiences = unstable_cache(
	async (locale: Locale): Promise<TransformedExperience[]> => {
		const data = await prisma.experience.findMany({
			orderBy: { startDate: "desc" },
			include: {
				// Fetch both current locale and English as a fallback
				translations: { where: { locale: { in: [locale, "en"] } } },
				techniques: {
					include: {
						translations: { where: { locale: { in: [locale, "en"] } } },
					},
				},
			},
		});

		return data.map((exp) => {
			// Priority: Requested Locale -> English -> First Available
			const trans =
				exp.translations.find((t) => t.locale === locale) ||
				exp.translations[0];

			return {
				...exp,
				startDate: exp.startDate.toISOString(),
				endDate: exp.endDate?.toISOString() || null,
				updatedAt: exp.updatedAt.toISOString(),
				// Mapped Translation Fields
				role: trans?.role || `Untitled Role`,
				employmentType: trans?.employmentType || null,
				description: trans?.description || null,
				// Full translations kept for admin edit forms if needed
				translations: exp.translations,
				techniques: exp.techniques.map((tech) => ({
					id: tech.id,
					icon: tech.icon,
					name:
						tech.translations.find((t) => t.locale === locale)?.name ||
						tech.translations[0]?.name ||
						"Skill",
				})),
			};
		});
	},
	["experience-list"], // Key is automatically scoped by arguments in newer Next versions,
	{ revalidate: 3600, tags: ["experience"] },
);

/**
 * EDUCATIONS
 */
export const getEducations = unstable_cache(
	async (locale: Locale): Promise<TransformedEducation[]> => {
		const data = await prisma.education.findMany({
			orderBy: { startDate: "desc" },
			include: {
				translations: { where: { locale: { in: [locale, "en"] } } },
				techniques: {
					include: {
						translations: { where: { locale: { in: [locale, "en"] } } },
					},
				},
			},
		});

		return data.map((edu) => {
			const trans =
				edu.translations.find((t) => t.locale === locale) ||
				edu.translations[0];

			return {
				id: edu.id,
				schoolName: edu.schoolName,
				schoolLogo: edu.schoolLogo,
				schoolWebsite: edu.schoolWebsite,
				location: edu.location,
				startDate: edu.startDate.toISOString(),
				endDate: edu.endDate?.toISOString() || null,
				isCurrent: edu.isCurrent,
				updatedAt: edu.updatedAt.toISOString(),
				// Mapped Translation Fields
				degree: trans?.degree || "Degree",
				fieldOfStudy: trans?.fieldOfStudy || null,
				description: trans?.description || null,
				translations: edu.translations,
				techniques: edu.techniques.map((tech) => ({
					id: tech.id,
					icon: tech.icon,
					name:
						tech.translations.find((t) => t.locale === locale)?.name ||
						tech.translations[0]?.name ||
						"Skill",
				})),
			};
		});
	},
	["education-list"],
	{ revalidate: 3600, tags: ["education"] },
);

/**
 * CERTIFICATIONS
 */
export const getCertifications = unstable_cache(
	async (locale: Locale): Promise<TransformedCertification[]> => {
		const data = await prisma.certification.findMany({
			orderBy: { issueDate: "desc" },
			include: {
				translations: { where: { locale: { in: [locale, "en"] } } },
			},
		});

		return data.map((cert) => {
			const trans =
				cert.translations.find((t) => t.locale === locale) ||
				cert.translations[0];

			return {
				id: cert.id,
				issuer: cert.issuer,
				coverUrl: cert.coverUrl,
				link: cert.link,
				issueDate: cert.issueDate.toISOString(),
				expireDate: cert.expireDate?.toISOString() || null,
				credentialUrl: cert.credentialUrl,
				isActive: cert.isActive,
				updatedAt: cert.updatedAt.toISOString(),
				// Mapped Translation Fields
				title: trans?.title || "Certificate",
				credentialId: trans?.credentialId || null,
				description: trans?.description || null,
				translations: cert.translations,
			};
		});
	},
	["certification-list"],
	{ revalidate: 3600, tags: ["certification"] },
);
