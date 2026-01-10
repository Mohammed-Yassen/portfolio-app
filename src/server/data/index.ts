/** @format */
import prisma from "@/lib/prisma";
import { Locale } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const getHeroData = unstable_cache(
	async (locale: Locale) => {
		const hero = await prisma.heroSection.findFirst({
			where: {
				// isActive: true, // We only want the one set to live
			},
			include: {
				translations: {
					where: { locale }, // Filter at the PRISprisma level for performance
				},
			},
			orderBy: {
				updatedAt: "desc", // Fallback: get the most recently updated active one
			},
		});

		if (!hero) return null;

		// Since translations is an array (due to the 1-to-many relation),
		// we take the first match for the current locale.
		const translation = hero.translations[0];

		return {
			id: hero.id,
			primaryImage: hero.primaryImage,
			resumeUrl: hero.resumeUrl,
			availability: hero.availability,
			updatedAt: hero.updatedAt,
			isActive: hero.isActive,

			// Merge translation fields into a content object
			content: {
				greeting: translation?.greeting ?? "",
				name: translation?.name ?? "",
				role: translation?.role ?? "",
				description: translation?.description ?? "",
				ctaText: translation?.ctaText ?? "",
				locale: translation?.locale ?? locale,
			},
		};
	},
	["hero-data"], // Base key
	{
		revalidate: 3600,
		tags: ["hero"],
	},
);
//
import { AboutData, TransformedSkillCategory } from "@/types";

const ABOUT_ID = "about-static";

export const getAboutData = unstable_cache(
	async (locale: Locale): Promise<AboutData | null> => {
		const about = await prisma.aboutSection.findUnique({
			where: { id: ABOUT_ID },
			include: {
				translations: {
					where: { locale },
				},
				statuses: {
					orderBy: { id: "asc" },
					include: {
						translations: {
							where: { locale },
						},
					},
				},
				corePillars: {
					orderBy: { id: "asc" },
					include: {
						translations: {
							where: { locale },
						},
					},
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
	{
		revalidate: 3600,
		tags: ["about"],
	},
);

export const getSkills = unstable_cache(
	async (locale: Locale): Promise<TransformedSkillCategory[]> => {
		try {
			const categories = await prisma.skillCategory.findMany({
				// We fetch everything (active and inactive) for a Dashboard Form
				orderBy: { order: "asc" },
				include: {
					translations: { where: { locale } },
					skills: {
						include: {
							translations: { where: { locale: "en" } },
						},
					},
				},
			});

			return categories.map((cat) => ({
				id: cat.id,
				icon: cat.icon,
				order: cat.order,
				isActive: cat.isActive,
				// Safely extract translation or provide a placeholder
				title: cat.translations[0]?.title || `No ${locale} title set`,
				skills: cat.skills.map((skill) => ({
					id: skill.id,
					name: skill.translations[0]?.name || "Unknown Skill",
					level: skill.level,
					icon: skill.icon,
				})),
			}));
		} catch (error) {
			console.error("Failed to fetch skills:", error);
			return []; // Return empty array to keep UI stable
		}
	},
	["skills-lists"], // Key
	{ revalidate: 10000, tags: ["skills"] }, // Cache configuration
);

import { TransformedExperience } from "@/types";

export const getExperiences = unstable_cache(
	async (locale: Locale): Promise<TransformedExperience[]> => {
		try {
			const experiences = await prisma.experience.findMany({
				// Order by most recent job first
				orderBy: { startDate: "desc" },
				include: {
					translations: {
						where: { locale },
					},
					techniques: {
						include: {
							translations: {
								where: { locale: "en" },
							},
						},
					},
				},
			});

			return experiences.map((exp) => ({
				id: exp.id,
				companyName: exp.companyName,
				companyLogo: exp.companyLogo,
				companyWebsite: exp.companyWebsite,
				location: exp.location,
				startDate: exp.startDate.toISOString(),
				endDate: exp.endDate?.toISOString() || null,
				isCurrent: exp.isCurrent,
				updatedAt: exp.updatedAt.toISOString(),

				// Safely extract main translation fields
				role: exp.translations[0]?.role || `No ${locale} role set`,
				employmentType: exp.translations[0]?.employmentType || null,
				description: exp.translations[0]?.description || null,

				// Keep all translations available for the editing form state
				translations: exp.translations,

				// Map nested techniques and their localized names
				techniques: exp.techniques.map((tech) => ({
					id: tech.id,
					icon: tech.icon,
					name: tech.translations[0]?.name || "Unknown Tech",
				})),
			}));
		} catch (error) {
			console.error("Failed to fetch experiences:", error);
			return [];
		}
	},
	["experiences-lists"], // Cache Key
	{
		revalidate: 3600,
		tags: ["experiences"], // Tag for manual revalidation in Server Actions
	},
);

import { TransformedEducation } from "@/types";

export const getEducations = unstable_cache(
	async (locale: Locale): Promise<TransformedEducation[]> => {
		try {
			const educations = await prisma.education.findMany({
				orderBy: { startDate: "desc" },
				include: {
					translations: {
						where: { locale },
					},
					techniques: {
						include: {
							translations: {
								where: { locale: "en" }, // Base name for techniques
							},
						},
					},
				},
			});

			return educations.map((edu) => ({
				id: edu.id,
				schoolName: edu.schoolName,
				schoolLogo: edu.schoolLogo,
				schoolWebsite: edu.schoolWebsite,
				location: edu.location,
				startDate: edu.startDate.toISOString(),
				endDate: edu.endDate?.toISOString() || null,
				isCurrent: edu.isCurrent,
				updatedAt: edu.updatedAt.toISOString(),

				// Safe extraction for current locale
				degree: edu.translations[0]?.degree || `No ${locale} degree set`,
				fieldOfStudy: edu.translations[0]?.fieldOfStudy || null,
				description: edu.translations[0]?.description || null,

				// Full translations for the edit form state
				translations: edu.translations,

				// Map nested skills/techniques
				techniques: edu.techniques.map((tech) => ({
					id: tech.id,
					icon: tech.icon,
					name: tech.translations[0]?.name || "Unknown Skill",
				})),
			}));
		} catch (error) {
			console.error("Failed to fetch educations:", error);
			return [];
		}
	},
	["educations-lists"],
	{
		revalidate: 3600,
		tags: ["educations"],
	},
);
import { TransformedCertification } from "@/types";

export const getCertifications = unstable_cache(
	async (locale: Locale): Promise<TransformedCertification[]> => {
		try {
			const certifications = await prisma.certification.findMany({
				orderBy: { issueDate: "desc" },
				include: {
					translations: {
						where: { locale },
					},
				},
			});

			return certifications.map((cert) => ({
				id: cert.id,
				issuer: cert.issuer,
				coverUrl: cert.coverUrl,
				link: cert.link,
				issueDate: cert.issueDate.toISOString(),
				expireDate: cert.expireDate?.toISOString() || null,
				credentialUrl: cert.credentialUrl,
				isActive: cert.isActive,
				updatedAt: cert.updatedAt.toISOString(),

				// Safe extraction for current locale
				title: cert.translations[0]?.title || `No ${locale} title set`,
				credentialId: cert.translations[0]?.credentialId || null,
				description: cert.translations[0]?.description || null,

				// Full translations for the edit form state
				translations: cert.translations,
			}));
		} catch (error) {
			console.error("Failed to fetch certifications:", error);
			return [];
		}
	},
	["certifications-lists"],
	{
		revalidate: 3600,
		tags: ["certifications"],
	},
);
