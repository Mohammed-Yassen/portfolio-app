/** @format */
"use server";
import prisma from "@/lib/prisma";
import {
	ProjectFormValues,
	ProjectSchema,
} from "../validations/project-validation";

import { revalidatePath } from "next/cache";
import { Locale } from "@prisma/client";

export async function createProjectAction(data: ProjectFormValues) {
	const validated = ProjectSchema.safeParse(data);
	if (!validated.success)
		return { success: false, error: "Validation failed." };

	const {
		id: _ignored,
		locale,
		title,
		description,
		content,
		tagIds,
		techniqueIds,
		newTags,
		newTechniques,
		...baseData
	} = validated.data;

	try {
		const result = await prisma.$transaction(async (tx) => {
			return await tx.project.create({
				data: {
					...baseData,
					translations: {
						create: {
							locale: locale as Locale,
							title,
							description,
							content: content ?? undefined,
						},
					},
					tags: {
						connect: tagIds?.map((id) => ({ id })) || [],
						// FIXED: Tags are localized in your DB
						create:
							newTags?.map((tag) => ({
								translations: {
									create: { locale: locale as Locale, name: tag.name },
								},
							})) || [],
					},
					techniques: {
						connect: techniqueIds?.map((id) => ({ id })) || [],
						// FIXED: Techniques are localized in your DB
						create:
							newTechniques?.map((tech) => ({
								icon: tech.icon,
								translations: {
									create: { locale: locale as Locale, name: tech.name },
								},
							})) || [],
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true, id: result.id };
	} catch (error) {
		console.error("[CREATE_PROJECT_ERROR]:", error);
		return { success: false, error: "Database creation failed." };
	}
}

/** @format */

export async function updateProjectAction(id: string, data: ProjectFormValues) {
	const validated = ProjectSchema.safeParse(data);
	if (!validated.success) return { success: false, error: "Invalid data" };

	const {
		id: _ignored, // We use the 'id' passed as the first argument to the function
		locale,
		title,
		description,
		content,
		tagIds,
		techniqueIds,
		newTags,
		newTechniques,
		...baseData // mainImage, slug, category, etc.
	} = validated.data;

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Localized Project Content (Upsert ensures multi-language support)
			await tx.projectTranslation.upsert({
				where: {
					projectId_locale: { projectId: id, locale: locale as Locale },
				},
				update: {
					title,
					description,
					content: content ?? undefined,
				},
				create: {
					projectId: id,
					locale: locale as Locale,
					title,
					description,
					content: content ?? undefined,
				},
			});

			// 2. Base Project Data & Many-to-Many Relations
			await tx.project.update({
				where: { id },
				data: {
					...baseData,
					// Note: We do NOT include 'translations' here because we handled it above
					tags: {
						// Sync existing links
						set: tagIds?.map((tagId) => ({ id: tagId })) || [],
						// Create brand new localized tags
						create:
							newTags?.map((tag) => ({
								translations: {
									create: {
										locale: locale as Locale,
										name: tag.name,
									},
								},
							})) || [],
					},
					techniques: {
						// Sync existing links
						set: techniqueIds?.map((techId) => ({ id: techId })) || [],
						// Create brand new localized techniques
						create:
							newTechniques?.map((tech) => ({
								icon: tech.icon,
								translations: {
									create: {
										locale: locale as Locale,
										name: tech.name,
									},
								},
							})) || [],
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		console.error("[UPDATE_PROJECT_ERROR]:", error);
		return { success: false, error: "Failed to update project." };
	}
}
export async function deleteProjectAction(id: string) {
	try {
		await prisma.$transaction(async (tx) => {
			// 1. Delete translations (Cascade might handle this, but explicit is safer)
			await tx.projectTranslation.deleteMany({ where: { projectId: id } });

			// 2. Delete the project record
			// Many-to-many join tables (ProjectOnTags etc) are handled automatically by Prisma
			await tx.project.delete({ where: { id } });
		});

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		console.error("DELETE_PROJECT_ERROR:", error);
		return { success: false, error: "Could not delete project" };
	}
}
