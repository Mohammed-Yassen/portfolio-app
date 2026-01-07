/** @format */
import { Locale, Prisma } from "@prisma/client";

export type BlogWithRelations = Prisma.BlogGetPayload<{
	include: {
		category: {
			include: {
				translations: { where: { locale: Locale }; select: { name: true } };
			};
		};
		translations: { where: { locale: Locale } };
		tags: {
			include: {
				translations: { where: { locale: Locale }; select: { name: true } };
			};
		};
		_count: { select: { likes: true; comments: true } };
	};
}>;

export interface TransformedBlog {
	id: string;
	slug: string;
	image: string;
	categoryId: string;
	categoryName: string; // Single category name
	isPublished: boolean;
	publishedAt: Date;
	locale: Locale;
	title: string;
	excerpt: string;
	content: string;
	metaTitle: string;
	metaDesc: string;
	tags: { id: string; name: string }[];
	likesCount: number;
	commentsCount: number;
}
