/** @format */
import prisma from "@/lib/prisma";
import { Locale, Prisma } from "@prisma/client";
import { BlogWithRelations, TransformedBlog } from "@/types/blog-types";

// 1. Define the include structure (Shared)
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

// 2. Define the transformation logic (Shared)
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

// 3. Get All Blogs
export const getBlogs = async (locale: Locale): Promise<TransformedBlog[]> => {
	try {
		const blogs = await prisma.blog.findMany({
			include: blogInclude(locale),
			orderBy: { publishedAt: "desc" },
			// Optional: only fetch published blogs
			where: { isPublished: true },
		});
		return (blogs as BlogWithRelations[]).map((b) => transformBlog(b, locale));
	} catch (error) {
		console.error("GET_BLOGS_ERROR", error);
		return [];
	}
};

// 4. Get Single Blog by ID
export const getBlogById = async (
	id: string,
	locale: Locale,
): Promise<TransformedBlog | null> => {
	try {
		const blog = await prisma.blog.findUnique({
			where: { id },
			include: blogInclude(locale),
		});

		if (!blog) return null;

		return transformBlog(blog as BlogWithRelations, locale);
	} catch (error) {
		console.error("GET_BLOG_BY_ID_ERROR", error);
		return null;
	}
};
