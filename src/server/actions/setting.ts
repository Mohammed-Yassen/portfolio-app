/** @format */
"use server";

import prisma from "@/lib/prisma";
import {
	HeroFormValues,
	heroSchema,
	sectionActiveSchema,
	SectionActiveValues,
	SkillCategoryFormValue,
	skillCategorySchema,
} from "@/server/validations";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateHeroAction(values: HeroFormValues) {
	// 1. Server-side validation
	const validatedFields = heroSchema.safeParse(values);
	if (!validatedFields.success) {
		return { success: false, error: "Invalid input fields." };
	}

	const data = validatedFields.data;
	const locale = data.locale;

	// Translation fields to avoid repetition
	const translationData = {
		greeting: data.greeting,
		name: data.name,
		role: data.role,
		description: data.description,
		ctaText: data.ctaText,
	};

	try {
		// 2. Check for the single Hero record
		const existingHero = await prisma.heroSection.findFirst();

		let result;

		if (existingHero) {
			// UPDATE: Existing Hero + Upsert Translation for the current locale
			result = await prisma.heroSection.update({
				where: { id: existingHero.id },
				data: {
					primaryImage: data.primaryImage,
					availability: data.availability,
					isActive: data.isActive,
					translations: {
						upsert: {
							where: {
								heroSectionId_locale: {
									heroSectionId: existingHero.id,
									locale: locale,
								},
							},
							create: { locale, ...translationData },
							update: { ...translationData },
						},
					},
				},
			});
		} else {
			// CREATE: First time setup
			result = await prisma.heroSection.create({
				data: {
					primaryImage: data.primaryImage,
					availability: data.availability,
					isActive: data.isActive,
					translations: {
						create: {
							locale,
							...translationData,
						},
					},
				},
			});
		}

		// 3. Clear cache so the site updates immediately
		revalidatePath("/[locale]/admin/setting", "page");
		revalidatePath("/[locale]", "layout");

		return { success: true, data: result };
	} catch (error) {
		console.error("HERO_UPDATE_ERROR:", error);

		// Handle specific Prisma unique constraint errors
		if (error === "P2002") {
			return {
				success: false,
				error: "A unique constraint failed. This locale might already exist.",
			};
		}

		return { success: false, error: "Something went wrong while saving." };
	}
}

export async function deleteHeroAction(id: string) {
	try {
		// Check existence before delete to avoid prisma crash
		const hero = await prisma.heroSection.findUnique({ where: { id } });
		if (!hero) return { success: false, error: "Hero section not found" };

		await prisma.heroSection.delete({ where: { id } });

		revalidatePath("/[locale]", "layout");
		return { success: true };
	} catch (error) {
		console.error("DELETE_HERO_ERROR:", error);
		return { success: false, error: "Failed to delete hero section" };
	}
}
//

import { AboutFormValues, aboutSchema } from "@/server/validations";

export async function updateAboutAction(values: AboutFormValues) {
	const validatedFields = aboutSchema.safeParse(values);
	if (!validatedFields.success) {
		return { success: false, error: "Invalid input fields." };
	}

	const { locale, title, subtitle, description, corePillars, statuses } =
		validatedFields.data;

	try {
		await prisma.$transaction(
			async (tx) => {
				// 1. Core Section
				await tx.aboutSection.upsert({
					where: { id: "about-static" },
					update: {},
					create: { id: "about-static" },
				});

				// 2. Main Translation
				await tx.aboutTranslation.upsert({
					where: {
						aboutSectionId_locale: { aboutSectionId: "about-static", locale },
					},
					create: {
						aboutSectionId: "about-static",
						locale,
						title,
						subtitle,
						description,
					},
					update: { title, subtitle, description },
				});

				// 3. Handle Statuses
				const currentStatuses = await tx.aboutStatus.findMany({
					where: { aboutSectionId: "about-static" },
					select: { id: true },
				});

				const incomingStatusIds = statuses
					.map((s) => s.id)
					.filter(Boolean) as string[];
				const statusesToDelete = currentStatuses.filter(
					(s) => !incomingStatusIds.includes(s.id),
				);

				if (statusesToDelete.length > 0) {
					await tx.aboutStatus.deleteMany({
						where: { id: { in: statusesToDelete.map((s) => s.id) } },
					});
				}

				for (const status of statuses) {
					const statusUpdate = await tx.aboutStatus.upsert({
						where: { id: status.id || "temp-new-id" },
						create: {
							aboutSectionId: "about-static",
							icon: status.icon,
							isActive: status.isActive,
						},
						update: { icon: status.icon, isActive: status.isActive },
					});

					await tx.statusTranslation.upsert({
						where: { statusId_locale: { statusId: statusUpdate.id, locale } },
						create: {
							statusId: statusUpdate.id,
							locale,
							label: status.label,
							value: status.value,
						},
						update: { label: status.label, value: status.value },
					});
				}

				// 4. Handle Pillars
				const currentPillars = await tx.corePillar.findMany({
					where: { aboutSectionId: "about-static" },
					select: { id: true },
				});

				const incomingPillarIds = corePillars
					.map((p) => p.id)
					.filter(Boolean) as string[];
				const pillarsToDelete = currentPillars.filter(
					(p) => !incomingPillarIds.includes(p.id),
				);

				if (pillarsToDelete.length > 0) {
					await tx.corePillar.deleteMany({
						where: { id: { in: pillarsToDelete.map((p) => p.id) } },
					});
				}

				for (const pillar of corePillars) {
					const pillarUpdate = await tx.corePillar.upsert({
						where: { id: pillar.id || "temp-new-id" },
						create: {
							aboutSectionId: "about-static",
							icon: pillar.icon,
						},
						update: { icon: pillar.icon },
					});

					await tx.pillarTranslation.upsert({
						where: { pillarId_locale: { pillarId: pillarUpdate.id, locale } },
						create: {
							pillarId: pillarUpdate.id,
							locale,
							title: pillar.title,
							description: pillar.description,
						},
						update: { title: pillar.title, description: pillar.description },
					});
				}
			},
			{ timeout: 20000 },
		);

		// FIX: Provided two arguments based on your local TypeScript alias
		// Usually 'default' or the specific profile used in your 'use cache' configuration
		revalidateTag("about", "default");
		revalidatePath("/", "layout");

		return { success: true };
	} catch (error) {
		console.error("Update Action Error:", error);
		return {
			success: false,
			error: "Failed to save data. Please try again.",
		};
	}
}

export async function upsertSkillCategoryAction(data: SkillCategoryFormValue) {
	// 1. Server-side validation
	const validatedFields = skillCategorySchema.safeParse(data);
	if (!validatedFields.success)
		return { success: false, error: "Invalid data" };

	const { id, title, icon, order, isActive, locale, skills } =
		validatedFields.data;

	try {
		const result = await prisma.$transaction(async (tx) => {
			// If editing, handle cleanup of nested translations/skills for this specific locale
			if (id) {
				// Remove existing translations for this locale to avoid unique constraint conflicts
				await tx.skillCategoryTranslation.deleteMany({
					where: { categoryId: id, locale },
				});

				// Optional: If you want to replace ALL skills every time you save:
				const currentSkills = await tx.skill.findMany({
					where: { categoryId: id },
					select: { id: true },
				});
				const skillIds = currentSkills.map((s) => s.id);

				await tx.skillTranslation.deleteMany({
					where: { skillId: { in: skillIds } },
				});
				await tx.skill.deleteMany({ where: { categoryId: id } });
			}

			// 2. Perform the Upsert
			return await tx.skillCategory.upsert({
				where: { id: id || "new-record" },
				update: {
					icon,
					order,
					isActive,
					translations: {
						create: { locale, title },
					},
					skills: {
						create: skills.map((s) => ({
							level: s.level,
							icon: s.icon,
							translations: {
								create: { locale, name: s.name },
							},
						})),
					},
				},
				create: {
					icon,
					order,
					isActive,
					translations: {
						create: { locale, title },
					},
					skills: {
						create: skills.map((s) => ({
							level: s.level,
							icon: s.icon,
							translations: {
								create: { locale, name: s.name },
							},
						})),
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true, id: result.id };
	} catch (error) {
		console.error("UPSERT_SKILL_ERROR:", error);
		return { success: false, error: "Database operation failed" };
	}
}

export async function deleteSkillCategoryAction(id: string) {
	if (!id) return { success: false, error: "ID is required" };

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Find all skills in this category
			const skills = await tx.skill.findMany({
				where: { categoryId: id },
				select: { id: true },
			});
			const skillIds = skills.map((s) => s.id);

			// 2. Cleanup all translations first (Manual cascade)
			await tx.skillTranslation.deleteMany({
				where: { skillId: { in: skillIds } },
			});
			await tx.skill.deleteMany({ where: { categoryId: id } });
			await tx.skillCategoryTranslation.deleteMany({
				where: { categoryId: id },
			});

			// 3. Final delete
			await tx.skillCategory.delete({ where: { id } });
		});

		revalidatePath("/", "layout");
		return { success: true, message: "Category deleted successfully" };
	} catch (error) {
		console.error("DELETE_SKILL_CATEGORY_ERROR:", error);
		return { success: false, error: "Failed to delete category" };
	}
}

// /** @format */

import { experienceSchema, ExperienceFormValue } from "@/server/validations";

export async function upsertExperienceAction(data: ExperienceFormValue) {
	// 1. Server-side validation
	const validatedFields = experienceSchema.safeParse(data);
	if (!validatedFields.success)
		return { success: false, error: "Invalid data" };

	const {
		id,
		companyName,
		companyLogo,
		companyWebsite,
		location,
		startDate,
		endDate,
		isCurrent,
		locale,
		role,
		employmentType,
		description,
		techniques,
	} = validatedFields.data;

	try {
		const result = await prisma.$transaction(async (tx) => {
			// Cleanup nested relations for this specific record/locale if editing
			if (id) {
				// Delete existing experience translations for this locale
				await tx.experienceTranslation.deleteMany({
					where: { experienceId: id, locale },
				});

				// Find and cleanup techniques
				const currentTechs = await tx.technique.findMany({
					where: { experienceId: id },
					select: { id: true },
				});
				const techIds = currentTechs.map((t) => t.id);

				// Remove technique translations for this locale
				await tx.techniqueTranslation.deleteMany({
					where: { techniqueId: { in: techIds }, locale },
				});

				// Remove techniques to prevent duplicates (recreated below)
				await tx.technique.deleteMany({ where: { experienceId: id } });
			}

			// 2. Perform the Upsert
			const experienceData = {
				companyName,
				companyLogo,
				companyWebsite,
				location,
				startDate: new Date(startDate),
				endDate: isCurrent ? null : endDate ? new Date(endDate) : null,
				isCurrent,
				translations: {
					create: { locale, role, employmentType, description },
				},
				techniques: {
					create: techniques.map((t) => ({
						icon: t.icon,
						translations: {
							create: { locale, name: t.name },
						},
					})),
				},
			};

			return await tx.experience.upsert({
				where: { id: id || "new-record" },
				update: experienceData,
				create: experienceData,
			});
		});

		revalidatePath("/", "layout");
		return { success: true, id: result.id };
	} catch (error) {
		console.error("UPSERT_EXPERIENCE_ERROR:", error);
		return { success: false, error: "Database operation failed" };
	}
}

export async function deleteExperienceAction(id: string) {
	if (!id) return { success: false, error: "ID is required" };

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Find all techniques to clean their translations
			const techniques = await tx.technique.findMany({
				where: { experienceId: id },
				select: { id: true },
			});
			const techIds = techniques.map((t) => t.id);

			// 2. Manual cleanup of translations (Manual Cascade)
			await tx.techniqueTranslation.deleteMany({
				where: { techniqueId: { in: techIds } },
			});

			await tx.technique.deleteMany({
				where: { experienceId: id },
			});

			await tx.experienceTranslation.deleteMany({
				where: { experienceId: id },
			});

			// 3. Final delete of parent
			await tx.experience.delete({ where: { id } });
		});

		revalidatePath("/", "layout");
		return { success: true, message: "Experience deleted successfully" };
	} catch (error) {
		console.error("DELETE_EXPERIENCE_ERROR:", error);
		return { success: false, error: "Failed to delete experience" };
	}
}

/** @format */

import { educationSchema, EducationFormValue } from "@/server/validations";
import { auth } from "@/auth";

export async function upsertEducationAction(data: EducationFormValue) {
	// 1. Server-side validation
	const validatedFields = educationSchema.safeParse(data);
	if (!validatedFields.success)
		return { success: false, error: "Invalid data" };

	const {
		id,
		schoolName,
		schoolLogo,
		schoolWebsite,
		location,
		startDate,
		endDate,
		isCurrent,
		locale,
		degree,
		fieldOfStudy,
		description,
		techniques,
	} = validatedFields.data;

	try {
		const result = await prisma.$transaction(async (tx) => {
			// 2. Manual Cleanup for existing records
			if (id) {
				// Delete existing education translations for this specific locale
				await tx.educationTranslation.deleteMany({
					where: { educationId: id, locale },
				});

				// Find techniques associated with this education to clean their translations
				const currentTechs = await tx.technique.findMany({
					where: { educationId: id },
					select: { id: true },
				});
				const techIds = currentTechs.map((t) => t.id);

				await tx.techniqueTranslation.deleteMany({
					where: { techniqueId: { in: techIds }, locale },
				});

				// Remove the techniques (they will be recreated in the upsert)
				await tx.technique.deleteMany({ where: { educationId: id } });
			}

			// 3. Prepare Data Structures
			// Flat fields go to the main Education table
			const baseFields = {
				schoolName,
				schoolLogo,
				schoolWebsite,
				location,
				startDate: new Date(startDate),
				endDate: isCurrent ? null : endDate ? new Date(endDate) : null,
				isCurrent,
			};

			// Relational fields handle the nested translations and techniques
			const relationFields = {
				translations: {
					create: {
						locale,
						degree,
						fieldOfStudy,
						description,
					},
				},
				techniques: {
					create: techniques.map((t) => ({
						icon: t.icon,
						translations: {
							create: { locale, name: t.name },
						},
					})),
				},
			};

			// 4. The Upsert
			// We pass the same combined object to both 'update' and 'create'
			const finalData = { ...baseFields, ...relationFields };

			return await tx.education.upsert({
				where: { id: id || "new-record" },
				update: finalData as never,
				create: finalData as never,
			});
		});

		revalidatePath("/", "layout");
		return { success: true, id: result.id };
	} catch (error) {
		console.error("UPSERT_EDUCATION_ERROR:", error);
		return {
			success: false,
			error: "Database operation failed. Ensure schema is synced.",
		};
	}
}
export async function deleteEducationAction(id: string) {
	if (!id) return { success: false, error: "ID is required" };

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Target all techniques learned in this education
			const techniques = await tx.technique.findMany({
				where: { educationId: id },
				select: { id: true },
			});
			const techIds = techniques.map((t) => t.id);

			// 2. Clear Technique Translations
			await tx.techniqueTranslation.deleteMany({
				where: { techniqueId: { in: techIds } },
			});

			// 3. Clear Techniques themselves
			await tx.technique.deleteMany({
				where: { educationId: id },
			});

			// 4. Clear Education Translations
			await tx.educationTranslation.deleteMany({
				where: { educationId: id },
			});

			// 5. Delete the Parent Record
			await tx.education.delete({ where: { id } });
		});

		revalidatePath("/", "layout");
		return { success: true, message: "Education deleted successfully" };
	} catch (error) {
		console.error("DELETE_EDUCATION_ERROR:", error);
		return { success: false, error: "Failed to delete education record" };
	}
}

/** @format */

export async function updateSectionStatus(values: SectionActiveValues) {
	try {
		// 1. Authorization Guard
		const session = await auth();
		const isAdmin = true;
		// session?.user?.role === "ADMIN" ||
		// session?.user?.email === process.env.ADMIN_EMAIL;
		if (!isAdmin) return { error: "UNAUTHORIZED_ACCESS" };

		// 2. Validate Input
		const validatedFields = sectionActiveSchema.safeParse(values);
		if (!validatedFields.success) {
			return { error: "INVALID_SCHEMA_DATA" };
		}

		// 3. Database Operation
		await prisma.sectionActive.upsert({
			where: { id: "ui-config" },
			update: validatedFields.data,
			create: {
				id: "ui-config",
				...validatedFields.data,
			},
		});

		// 4. Cache Clearing
		revalidatePath("/", "layout"); // Update public site
		revalidatePath("/admin/settings"); // Update admin dashboard

		return { success: "CONFIG_SYNCED" };
	} catch (error) {
		// Log the actual error to your terminal for debugging
		console.error("[SECTION_UPDATE_ERROR]:", error);
		return { error: "DATABASE_SYNC_FAILED" };
	}
}

// /generate write actions for certification create ,update and delete based on schema  model Certification {   id            String    @id @default(cuid())   issuer        String   coverUrl      String?   link          String? // External link to verify   issueDate     DateTime   expireDate    DateTime?   credentialUrl String?   isActive      Boolean   @default(true)    translations CertificationTranslation[]   createdAt    DateTime                   @default(now())   updatedAt    DateTime                   @updatedAt }  model CertificationTranslation {   id           String  @id @default(cuid())   locale       Locale   title        String // e.g., "AWS Certified Solutions Architect"   credentialId String?    description     String?       @db.Text   certificationId String   certification   Certification @relation(fields: [certificationId], references: [id], onDelete: Cascade)    @@unique([certificationId, locale]) }

import {
	certificationSchema,
	type CertificationFormValue,
} from "@/server/validations";

/**
 * Standardized Action Response Type
 */
type ActionResponse<T = undefined> =
	| { success: true; data?: T; message?: string }
	| { success: false; error: string };

/**
 * Creates or updates a certification and its associated translation.
 */
export async function upsertCertificationAction(
	rawInput: CertificationFormValue,
): Promise<ActionResponse<{ id: string }>> {
	// 1. Validate Input
	const validated = certificationSchema.safeParse(rawInput);

	if (!validated.success) {
		return {
			success: false,
			error: `Validation failed: ${validated.error?.issues
				.map((e) => e.message)
				.join(", ")}`,
		};
	}

	const { id, locale, title, credentialId, description, ...baseData } =
		validated.data;

	try {
		const result = await prisma.$transaction(async (tx) => {
			// 2. Manage Translations
			// If updating, we replace the translation for the specific locale
			if (id) {
				await tx.certificationTranslation.deleteMany({
					where: { certificationId: id, locale },
				});
			}

			// 3. Perform Upsert
			// We use a specific ID if provided, otherwise Prisma generates a new CUID/UUID
			return await tx.certification.upsert({
				where: { id: id ?? "" },
				update: {
					...baseData,
					issueDate: new Date(baseData.issueDate),
					expireDate: baseData.expireDate
						? new Date(baseData.expireDate)
						: null,
					translations: {
						create: {
							locale,
							title,
							credentialId: credentialId || null,
							description: description || null,
						},
					},
				},
				create: {
					...baseData,
					issueDate: new Date(baseData.issueDate),
					expireDate: baseData.expireDate
						? new Date(baseData.expireDate)
						: null,
					translations: {
						create: {
							locale,
							title,
							credentialId: credentialId || null,
							description: description || null,
						},
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true, data: { id: result.id } };
	} catch (error) {
		console.error("[UPSERT_CERTIFICATION_ERROR]", error);
		return { success: false, error: "An unexpected database error occurred." };
	}
}

/**
 * Deletes a certification.
 * Assumes 'onDelete: Cascade' is set in the Prisma Schema for translations.
 */
export async function deleteCertificationAction(
	id: string,
): Promise<ActionResponse> {
	if (!id)
		return { success: false, error: "A valid ID is required for deletion." };

	try {
		await prisma.certification.delete({
			where: { id },
		});

		revalidatePath("/", "layout");
		return { success: true, message: "Certification deleted successfully." };
	} catch (error) {
		console.error("[DELETE_CERTIFICATION_ERROR]", error);
		return {
			success: false,
			error:
				"Failed to delete certification. It may have already been removed.",
		};
	}
}
