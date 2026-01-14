/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSecureAction } from "@/lib/safe-action";
import { BlogSchema } from "../validations/blog-validation";
import { z } from "zod";

// Create a type derived from the schema to replace 'unknown' and 'as object'
type BlogInput = z.infer<typeof BlogSchema>;

/**
 * CREATE BLOG ACTION
 */
export async function createBlogAction(values: BlogInput) {
	return createSecureAction(
		values,
		{
			schema: BlogSchema,
			accessLevel: ["SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
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
			} = data;

			const targetCategoryId = categoryIds?.[0] || null;

			const result = await prisma.$transaction(async (tx) => {
				return await tx.blog.create({
					data: {
						slug: slug.toLowerCase().trim(),
						image,
						isPublished,
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
			return { id: result.id };
		},
	);
}

/**
 * UPDATE BLOG ACTION
 */
export async function updateBlogAction(id: string, values: BlogInput) {
	// We combine id and values into a single object for validation without using 'as object'
	const payload = { ...values, id };
	const UpdateSchema = BlogSchema.extend({ id: z.string().min(1) });

	return createSecureAction(
		payload,
		{
			schema: UpdateSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const {
				id,
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
			} = data;

			const targetCategoryId = categoryIds?.[0] || null;

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

				// 2. Update Blog Root and Relationships
				await tx.blog.update({
					where: { id },
					data: {
						slug: slug.toLowerCase().trim(),
						image,
						isPublished,
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
		},
	);
}

/**
 * DELETE BLOG ACTION
 */
export async function deleteBlogAction(id: string) {
	const DeleteSchema = z.object({ id: z.string().min(1) });

	return createSecureAction(
		{ id },
		{
			schema: DeleteSchema,
			accessLevel: ["SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			await prisma.blog.delete({ where: { id: data.id } });
			revalidatePath("/", "layout");
			return { success: true };
		},
	);
} // /** @format */
// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { createSecureAction } from "@/lib/safe-action";
// import { BlogSchema } from "../validations/blog-validation";
// import { z } from "zod";

// /**
//  * CREATE BLOG ACTION
//  */
// export async function createBlogAction(values: unknown) {
// 	return createSecureAction(
// 		values,
// 		{
// 			schema: BlogSchema,
// 			accessLevel: ["SUPER_ADMIN", "OWNER"],
// 		},
// 		async (data) => {
// 			const {
// 				locale,
// 				title,
// 				excerpt,
// 				content,
// 				metaTitle,
// 				metaDesc,
// 				tagIds,
// 				newTags,
// 				categoryIds,
// 				slug,
// 				image,
// 				isPublished,
// 			} = data;

// 			const targetCategoryId = categoryIds?.[0] || null;
// 			// Y &q%sGm*82a5GJ-#
// 			const result = await prisma.$transaction(async (tx) => {
// 				return await tx.blog.create({
// 					data: {
// 						slug: slug.toLowerCase().trim(),
// 						image,
// 						isPublished,
// 						...(targetCategoryId && {
// 							category: { connect: { id: targetCategoryId } },
// 						}),
// 						translations: {
// 							create: {
// 								locale,
// 								title,
// 								excerpt,
// 								content,
// 								metaTitle: metaTitle ?? null,
// 								metaDesc: metaDesc ?? null,
// 							},
// 						},
// 						tags: {
// 							connect: tagIds?.map((id) => ({ id })) || [],
// 							create:
// 								newTags?.map((tag) => ({
// 									translations: {
// 										create: { locale, name: tag.name.trim() },
// 									},
// 								})) || [],
// 						},
// 					},
// 				});
// 			});

// 			revalidatePath("/", "layout");
// 			return { id: result.id };
// 		},
// 	);
// }

// /**
//  * UPDATE BLOG ACTION
//  */
// export async function updateBlogAction(id: string, values: unknown) {
// 	// We combine id and values so the wrapper can validate the whole payload
// 	return createSecureAction(
// 		{ id, ...(values as object) },
// 		{
// 			schema: BlogSchema.extend({ id: z.string().min(1) }),
// 			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
// 		},
// 		async (data) => {
// 			const {
// 				id,
// 				locale,
// 				slug,
// 				title,
// 				excerpt,
// 				content,
// 				metaTitle,
// 				metaDesc,
// 				tagIds,
// 				newTags,
// 				categoryIds,
// 				image,
// 				isPublished,
// 			} = data;

// 			const targetCategoryId = categoryIds?.[0] || null;

// 			await prisma.$transaction(async (tx) => {
// 				// 1. Upsert Blog Translation
// 				await tx.blogTranslation.upsert({
// 					where: { blogId_locale: { blogId: id, locale } },
// 					update: {
// 						title,
// 						excerpt,
// 						content,
// 						metaTitle: metaTitle ?? null,
// 						metaDesc: metaDesc ?? null,
// 					},
// 					create: {
// 						blogId: id,
// 						locale,
// 						title,
// 						excerpt,
// 						content,
// 						metaTitle: metaTitle ?? null,
// 						metaDesc: metaDesc ?? null,
// 					},
// 				});

// 				// 2. Update Blog Root and Relationships
// 				await tx.blog.update({
// 					where: { id },
// 					data: {
// 						slug: slug.toLowerCase().trim(),
// 						image,
// 						isPublished,
// 						category: targetCategoryId
// 							? { connect: { id: targetCategoryId } }
// 							: { disconnect: true },
// 						tags: {
// 							set: tagIds?.map((tId) => ({ id: tId })) || [],
// 							create:
// 								newTags?.map((tag) => ({
// 									translations: {
// 										create: { locale, name: tag.name.trim() },
// 									},
// 								})) || [],
// 						},
// 					},
// 				});
// 			});

// 			revalidatePath("/", "layout");
// 			return { success: true };
// 		},
// 	);
// }

// /**
//  * DELETE BLOG ACTION
//  */
// export async function deleteBlogAction(id: string) {
// 	return createSecureAction(
// 		{ id },
// 		{
// 			schema: z.object({ id: z.string().min(1) }),
// 			accessLevel: ["SUPER_ADMIN", "OWNER"],
// 		},
// 		async (data) => {
// 			await prisma.blog.delete({ where: { id: data.id } });
// 			revalidatePath("/", "layout");
// 			return { success: true };
// 		},
// 	);
// }
