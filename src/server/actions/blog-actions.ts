/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { BlogFormValues, BlogSchema } from "../validations/blog-validation";

/**
 * Shared error handler using Prisma's error types instead of 'any'
 */
const handleActionError = (error: unknown, context: string) => {
	console.error(`[${context}]:`, error);

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === "P2002") {
			return { success: false, error: "A blog with this slug already exists." };
		}
	}

	return {
		success: false,
		error: "A database error occurred. Please try again.",
	};
};

export async function createBlogAction(data: BlogFormValues) {
	const validated = BlogSchema.safeParse(data);
	if (!validated.success)
		return { success: false, error: "Validation failed." };

	const {
		locale,
		title,
		excerpt,
		content,
		metaTitle,
		metaDesc,
		tagIds,
		newTags,
		categoryIds,
		slug,
		image,
		isPublished,
	} = validated.data;

	// Logic: Extract the first ID if it exists, else null
	const targetCategoryId =
		categoryIds && categoryIds.length > 0 ? categoryIds[0] : null;

	try {
		const result = await prisma.$transaction(async (tx) => {
			return await tx.blog.create({
				data: {
					slug: slug.toLowerCase().trim(),
					image,
					isPublished,
					// If targetCategoryId exists, connect it; otherwise, do nothing
					...(targetCategoryId && {
						category: { connect: { id: targetCategoryId } },
					}),
					translations: {
						create: {
							locale,
							title,
							excerpt,
							content,
							metaTitle: metaTitle ?? null,
							metaDesc: metaDesc ?? null,
						},
					},
					tags: {
						connect: tagIds?.map((id) => ({ id })) || [],
						create:
							newTags?.map((tag) => ({
								translations: {
									create: { locale, name: tag.name.trim() },
								},
							})) || [],
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true, id: result.id };
	} catch (error) {
		return handleActionError(error, "CREATE_BLOG_ERROR");
	}
}

export async function updateBlogAction(id: string, data: BlogFormValues) {
	const validated = BlogSchema.safeParse(data);
	if (!validated.success) return { success: false, error: "Invalid data." };

	const {
		locale,
		slug,
		title,
		excerpt,
		content,
		metaTitle,
		metaDesc,
		tagIds,
		newTags,
		categoryIds,
		image,
		isPublished,
	} = validated.data;

	const targetCategoryId =
		categoryIds && categoryIds.length > 0 ? categoryIds[0] : null;

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Upsert Blog Translation
			await tx.blogTranslation.upsert({
				where: { blogId_locale: { blogId: id, locale } },
				update: {
					title,
					excerpt,
					content,
					metaTitle: metaTitle ?? null,
					metaDesc: metaDesc ?? null,
				},
				create: {
					blogId: id,
					locale,
					title,
					excerpt,
					content,
					metaTitle: metaTitle ?? null,
					metaDesc: metaDesc ?? null,
				},
			});

			// 2. Update Blog and Relationships
			await tx.blog.update({
				where: { id },
				data: {
					slug: slug.toLowerCase().trim(),
					image,
					isPublished,
					// Handle Category connection/disconnection
					category: targetCategoryId
						? { connect: { id: targetCategoryId } }
						: { disconnect: true },
					tags: {
						set: tagIds?.map((tId) => ({ id: tId })) || [],
						create:
							newTags?.map((tag) => ({
								translations: {
									create: { locale, name: tag.name.trim() },
								},
							})) || [],
					},
				},
			});
		});

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return handleActionError(error, "UPDATE_BLOG_ERROR");
	}
}

export async function deleteBlogAction(id: string) {
	try {
		await prisma.blog.delete({ where: { id } });
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return handleActionError(error, "DELETE_BLOG_ERROR");
	}
}
