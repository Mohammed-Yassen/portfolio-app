/** @format */
import prisma from "@/lib/prisma";
import { Locale, Prisma } from "@prisma/client";
import { BlogWithRelations, TransformedBlog } from "@/types/blog-types";

const blogInclude = (locale: Locale) =>
	({
		category: {
			include: { translations: { where: { locale } } },
		},
		translations: { where: { locale } },
		tags: {
			include: { translations: { where: { locale } } },
		},
		_count: { select: { likes: true, comments: true } },
	} satisfies Prisma.BlogInclude);

const transformBlog = (
	blog: BlogWithRelations,
	locale: Locale,
): TransformedBlog => {
	const trans = blog.translations[0];
	const catTrans = blog.category?.translations[0];

	return {
		id: blog.id,
		slug: blog.slug,
		image: blog.image,
		categoryId: blog.categoryId || "",
		categoryName: catTrans?.name || "Uncategorized",
		isPublished: blog.isPublished,
		publishedAt: blog.publishedAt,
		locale,
		title: trans?.title || "Untitled",
		excerpt: trans?.excerpt || "",
		content: trans?.content || "",
		metaTitle: trans?.metaTitle || "",
		metaDesc: trans?.metaDesc || "",
		tags: blog.tags.map((t) => ({
			id: t.id,
			name: t.translations[0]?.name || "Unnamed Tag",
		})),
		likesCount: blog._count.likes,
		commentsCount: blog._count.comments,
	};
};

export const getBlogs = async (locale: Locale): Promise<TransformedBlog[]> => {
	try {
		const blogs = await prisma.blog.findMany({
			include: blogInclude(locale),
			orderBy: { publishedAt: "desc" },
		});
		// Cast to ensure TS recognizes the include structure
		return (blogs as BlogWithRelations[]).map((b) => transformBlog(b, locale));
	} catch (error) {
		console.error("GET_BLOGS_ERROR", error);
		return [];
	}
};
