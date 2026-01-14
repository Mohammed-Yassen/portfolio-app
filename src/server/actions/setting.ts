/** @format */
"use server";

import prisma from "@/lib/prisma";
import {
	AboutFormValues,
	CertificationFormValue,
	HeroFormValues,
	heroSchema,
	sectionActiveSchema,
	SectionActiveValues,
	SkillCategoryFormValue,
	skillCategorySchema,
	experienceSchema,
	ExperienceFormValue,
	educationSchema,
	EducationFormValue,
	certificationSchema,
} from "@/server/validations";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createSecureAction } from "@/lib/safe-action";
import { aboutSchema } from "@/server/validations";

const ABOUT_ID = "about-static";

// Use a constant for singleton records to avoid multiple hero sections
const HERO_ID = "hero-static"; // Matches your @default("hero-static") in Prisma

export async function updateHeroAction(values: HeroFormValues) {
	return createSecureAction(
		values,
		{
			schema: heroSchema, // Assuming heroSchema includes locale, primaryImage, etc.
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data, ctx) => {
			const {
				locale,
				primaryImage,
				availability,
				isActive,
				resumeUrl,
				id,
				...translations
			} = data;

			// Prepare the payload for both Create and Update
			const translationData = {
				...translations,
				resumeUrl: resumeUrl || undefined,
				locale,
			};

			// Atomic Upsert: Handles the root record and the specific locale translation together
			return await prisma.heroSection
				.upsert({
					where: { id: HERO_ID },
					create: {
						id: HERO_ID,
						primaryImage,
						availability,
						isActive, // Ensure isActive is passed here
						translations: {
							create: [translationData],
						},
					},
					update: {
						primaryImage,
						availability,
						isActive, // Ensure isActive is passed here
						translations: {
							upsert: {
								where: {
									heroSectionId_locale: {
										heroSectionId: HERO_ID,
										locale,
									},
								},
								create: translationData,
								update: translationData,
							}, // Ensure translationData is correctly passed
						},
					},
				})
				.finally(() => {
					revalidatePath("/", "layout"); // Global revalidate
					revalidatePath(`/${locale}`, "layout");
				});
		},
	);
}

export async function deleteHeroAction(id: string) {
	return createSecureAction(
		{ id },
		{
			schema: z.object({ id: z.string() }),
			accessLevel: ["OWNER", "SUPER_ADMIN"], // Higher protection for deletion
		},
		async (data) => {
			// deleteMany is safer than delete because it doesn't throw if record is already gone
			const result = await prisma.heroSection.deleteMany({
				where: { id: data.id },
			});

			if (result.count > 0) {
				revalidatePath("/", "layout");
			}

			return { deletedCount: result.count };
		},
	);
}

export async function updateAboutAction(values: AboutFormValues) {
	return createSecureAction(
		values,
		{
			schema: aboutSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const { locale, title, subtitle, description, corePillars, statuses } =
				data;

			await prisma.$transaction(
				async (tx) => {
					// 1. Core Section
					await tx.aboutSection.upsert({
						where: { id: ABOUT_ID },
						update: {},
						create: { id: ABOUT_ID },
					});

					// 2. Main Translation
					await tx.aboutTranslation.upsert({
						where: {
							aboutSectionId_locale: { aboutSectionId: ABOUT_ID, locale },
						},
						create: {
							aboutSectionId: ABOUT_ID,
							locale,
							title,
							subtitle,
							description,
						},
						update: { title, subtitle, description },
					});

					// 3. Statuses Sync (Delete removed, Upsert remaining)
					const incomingStatusIds = statuses
						.map((s) => s.id)
						.filter(Boolean) as string[];
					await tx.aboutStatus.deleteMany({
						where: {
							aboutSectionId: ABOUT_ID,
							id: { notIn: incomingStatusIds },
						},
					});

					for (const status of statuses) {
						const updatedStatus = await tx.aboutStatus.upsert({
							where: { id: status.id || "new-status" },
							create: {
								aboutSectionId: ABOUT_ID,
								icon: status.icon,
								isActive: status.isActive,
							},
							update: { icon: status.icon, isActive: status.isActive },
						});

						await tx.statusTranslation.upsert({
							where: {
								statusId_locale: { statusId: updatedStatus.id, locale },
							},
							create: {
								statusId: updatedStatus.id,
								locale,
								label: status.label,
								value: status.value,
							},
							update: { label: status.label, value: status.value },
						});
					}

					// 4. Pillars Sync
					const incomingPillarIds = corePillars
						.map((p) => p.id)
						.filter(Boolean) as string[];
					await tx.corePillar.deleteMany({
						where: {
							aboutSectionId: ABOUT_ID,
							id: { notIn: incomingPillarIds },
						},
					});

					for (const pillar of corePillars) {
						const updatedPillar = await tx.corePillar.upsert({
							where: { id: pillar.id || "new-pillar" },
							create: { aboutSectionId: ABOUT_ID, icon: pillar.icon },
							update: { icon: pillar.icon },
						});

						await tx.pillarTranslation.upsert({
							where: {
								pillarId_locale: { pillarId: updatedPillar.id, locale },
							},
							create: {
								pillarId: updatedPillar.id,
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

			revalidateTag("about", "default");
			revalidatePath("/", "layout");
			return { success: true };
		},
	);
}

export async function upsertSkillCategoryAction(
	values: SkillCategoryFormValue,
) {
	return createSecureAction(
		values,
		{
			schema: skillCategorySchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const { id, title, icon, order, isActive, locale, skills } = data;

			const result = await prisma.$transaction(async (tx) => {
				if (id) {
					// Cleanup current locale translations and children
					await tx.skillCategoryTranslation.deleteMany({
						where: { categoryId: id, locale },
					});
					const currentSkills = await tx.skill.findMany({
						where: { categoryId: id },
						select: { id: true },
					});
					const skillIds = currentSkills.map((s) => s.id);
					await tx.skillTranslation.deleteMany({
						where: { skillId: { in: skillIds }, locale },
					});
					await tx.skill.deleteMany({ where: { categoryId: id } });
				}

				return await tx.skillCategory.upsert({
					where: { id: id || "new-skill-cat" },
					update: {
						icon,
						order,
						isActive,
						translations: { create: { locale, title } },
						skills: {
							create: skills.map((s) => ({
								level: s.level,
								icon: s.icon,
								translations: { create: { locale, name: s.name } },
							})),
						},
					},
					create: {
						icon,
						order,
						isActive,
						translations: { create: { locale, title } },
						skills: {
							create: skills.map((s) => ({
								level: s.level,
								icon: s.icon,
								translations: { create: { locale, name: s.name } },
							})),
						},
					},
				});
			});

			revalidatePath("/", "layout");
			return { id: result.id };
		},
	);
}

export async function deleteSkillCategoryAction(id: string) {
	return createSecureAction(
		{ id },
		{
			schema: z.object({ id: z.string().min(1) }),
			accessLevel: ["SUPER_ADMIN", "OWNER"], // Deletion restricted to higher tiers
		},
		async (data) => {
			await prisma.$transaction(async (tx) => {
				const skills = await tx.skill.findMany({
					where: { categoryId: data.id },
					select: { id: true },
				});
				const skillIds = skills.map((s) => s.id);

				// Manual Cascade (if not set in Prisma Schema)
				await tx.skillTranslation.deleteMany({
					where: { skillId: { in: skillIds } },
				});
				await tx.skill.deleteMany({ where: { categoryId: data.id } });
				await tx.skillCategoryTranslation.deleteMany({
					where: { categoryId: data.id },
				});
				await tx.skillCategory.delete({ where: { id: data.id } });
			});

			revalidatePath("/", "layout");
			return { success: true };
		},
	);
}
// /** @format */

export async function upsertExperienceAction(values: ExperienceFormValue) {
	return createSecureAction(
		values,
		{
			schema: experienceSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const {
				id,
				locale,
				role,
				employmentType,
				description,
				techniques,
				...root
			} = data;

			const result = await prisma.$transaction(async (tx) => {
				// 1. Precise Cleanup for the specific locale if editing
				if (id) {
					await tx.experienceTranslation.deleteMany({
						where: { experienceId: id, locale },
					});

					const currentTechs = await tx.technique.findMany({
						where: { experienceId: id },
						select: { id: true },
					});
					const techIds = currentTechs.map((t) => t.id);

					await tx.techniqueTranslation.deleteMany({
						where: { techniqueId: { in: techIds }, locale },
					});
					await tx.technique.deleteMany({ where: { experienceId: id } });
				}

				// 2. Structured Payload
				const experiencePayload = {
					...root,
					startDate: new Date(root.startDate),
					endDate: root.isCurrent
						? null
						: root.endDate
						? new Date(root.endDate)
						: null,
					translations: {
						create: { locale, role, employmentType, description },
					},
					techniques: {
						create: techniques.map((t) => ({
							icon: t.icon,
							translations: { create: { locale, name: t.name } },
						})),
					},
				};

				return await tx.experience.upsert({
					where: { id: id || "new-experience" },
					update: experiencePayload,
					create: experiencePayload,
				});
			});

			revalidatePath("/", "layout");
			return { id: result.id };
		},
	);
}

export async function deleteExperienceAction(id: string) {
	return createSecureAction(
		{ id },
		{
			schema: z.object({ id: z.string().min(1) }),
			accessLevel: ["SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			await prisma.$transaction(async (tx) => {
				const techniques = await tx.technique.findMany({
					where: { experienceId: data.id },
					select: { id: true },
				});
				const techIds = techniques.map((t) => t.id);

				await tx.techniqueTranslation.deleteMany({
					where: { techniqueId: { in: techIds } },
				});
				await tx.technique.deleteMany({ where: { experienceId: data.id } });
				await tx.experienceTranslation.deleteMany({
					where: { experienceId: data.id },
				});
				await tx.experience.delete({ where: { id: data.id } });
			});

			revalidatePath("/", "layout");
			return { success: true };
		},
	);
}
/** @format */

export async function upsertEducationAction(values: EducationFormValue) {
	return createSecureAction(
		values,
		{
			schema: educationSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const {
				id,
				locale,
				degree,
				fieldOfStudy,
				description,
				techniques,
				...root
			} = data;

			const result = await prisma.$transaction(async (tx) => {
				// 1. Locale-based cleanup
				if (id) {
					await tx.educationTranslation.deleteMany({
						where: { educationId: id, locale },
					});

					const currentTechs = await tx.technique.findMany({
						where: { educationId: id },
						select: { id: true },
					});
					const techIds = currentTechs.map((t) => t.id);

					await tx.techniqueTranslation.deleteMany({
						where: { techniqueId: { in: techIds }, locale },
					});
					await tx.technique.deleteMany({ where: { educationId: id } });
				}

				// 2. Prepare Atomic Upsert Data
				const educationPayload = {
					schoolName: root.schoolName,
					schoolLogo: root.schoolLogo,
					schoolWebsite: root.schoolWebsite,
					location: root.location,
					startDate: new Date(root.startDate),
					endDate: root.isCurrent
						? null
						: root.endDate
						? new Date(root.endDate)
						: null,
					isCurrent: root.isCurrent,
					translations: {
						create: { locale, degree, fieldOfStudy, description },
					},
					techniques: {
						create: techniques.map((t) => ({
							icon: t.icon,
							translations: { create: { locale, name: t.name } },
						})),
					},
				};

				return await tx.education.upsert({
					where: { id: id || "new-education" },
					update: educationPayload,
					create: educationPayload,
				});
			});

			revalidatePath("/", "layout");
			return { id: result.id };
		},
	);
}

export async function deleteEducationAction(id: string) {
	return createSecureAction(
		{ id },
		{
			schema: z.object({ id: z.string().min(1) }),
			accessLevel: ["SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			await prisma.$transaction(async (tx) => {
				const techniques = await tx.technique.findMany({
					where: { educationId: data.id },
					select: { id: true },
				});
				const techIds = techniques.map((t) => t.id);

				await tx.techniqueTranslation.deleteMany({
					where: { techniqueId: { in: techIds } },
				});
				await tx.technique.deleteMany({ where: { educationId: data.id } });
				await tx.educationTranslation.deleteMany({
					where: { educationId: data.id },
				});
				await tx.education.delete({ where: { id: data.id } });
			});

			revalidatePath("/", "layout");
			return { success: true };
		},
	);
}

//

export async function upsertCertificationAction(
	values: CertificationFormValue,
) {
	return createSecureAction(
		values,
		{
			schema: certificationSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const { id, locale, title, credentialId, description, ...root } = data;

			const result = await prisma.$transaction(async (tx) => {
				// 1. If editing, clean up the translation for this specific locale only
				if (id) {
					await tx.certificationTranslation.deleteMany({
						where: { certificationId: id, locale },
					});
				}

				const certPayload = {
					issuer: root.issuer,
					coverUrl: root.coverUrl,
					link: root.link,
					credentialUrl: root.credentialUrl,
					isActive: root.isActive,
					issueDate: new Date(root.issueDate),
					expireDate: root.expireDate ? new Date(root.expireDate) : null,
					translations: {
						create: {
							locale,
							title,
							credentialId: credentialId || null,
							description: description || null,
						},
					},
				};

				return await tx.certification.upsert({
					where: { id: id || "new-cert" },
					update: certPayload,
					create: certPayload,
				});
			});

			revalidatePath("/", "layout");
			return { id: result.id };
		},
	);
}

export async function deleteCertificationAction(id: string) {
	return createSecureAction(
		{ id },
		{
			schema: z.object({ id: z.string().min(1) }),
			accessLevel: ["SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			// Note: CertificationTranslation is deleted automatically
			// via 'onDelete: Cascade' in your schema.
			await prisma.certification.delete({
				where: { id: data.id },
			});

			revalidatePath("/", "layout");
			return { success: true };
		},
	);
}
// /generate write actions for certification create ,update and delete based on schema  model Certification {   id            String    @id @default(cuid())   issuer        String   coverUrl      String?   link          String? // External link to verify   issueDate     DateTime   expireDate    DateTime?   credentialUrl String?   isActive      Boolean   @default(true)    translations CertificationTranslation[]   createdAt    DateTime                   @default(now())   updatedAt    DateTime                   @updatedAt }  model CertificationTranslation {   id           String  @id @default(cuid())   locale       Locale   title        String // e.g., "AWS Certified Solutions Architect"   credentialId String?    description     String?       @db.Text   certificationId String   certification   Certification @relation(fields: [certificationId], references: [id], onDelete: Cascade)    @@unique([certificationId, locale]) }
/** @format */

export async function updateSectionStatusAction(values: SectionActiveValues) {
	return createSecureAction(
		values,
		{
			schema: sectionActiveSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const CONFIG_ID = "ui-config";

			await prisma.sectionActive.upsert({
				where: { id: CONFIG_ID },
				update: data,
				create: {
					id: CONFIG_ID,
					...data,
				},
			});

			// Revalidate multiple paths to ensure Admin and Public site stay in sync
			revalidatePath("/", "layout");
			revalidatePath("/admin/settings");

			return { success: true };
		},
	);
}
