/** @format */
import { getBlogs } from "@/server/data/blogs";
import { Locale } from "@prisma/client";
import prisma from "@/lib/prisma";
import { BlogFormContainer } from "./blogs-contol";

interface Props {
	params: Promise<{ locale: Locale }>;
}

export default async function BlogsControlPage({ params }: Props) {
	const { locale } = await params;

	// Parallelized fetch for high-speed page loading
	const [blogs, categories, tags] = await Promise.all([
		getBlogs(locale),
		prisma.category.findMany({
			select: {
				id: true,
				translations: {
					where: { locale },
					select: { name: true },
				},
			},
		}),
		prisma.tag.findMany({
			select: {
				id: true,
				translations: {
					where: { locale },
					select: { name: true },
				},
			},
		}),
	]);

	// Flatten translations for cleaner prop drilling
	const availableCategories = categories.map((c) => ({
		id: c.id,
		name: c.translations[0]?.name || "Unnamed Category",
	}));

	const availableTags = tags.map((t) => ({
		id: t.id,
		name: t.translations[0]?.name || "Unnamed Tag",
	}));

	return (
		<div className='p-4 md:px-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen'>
			<header className='flex justify-between items-end max-w-7xl mx-auto'>
				<div>
					<h1 className='text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter'>
						Dashboard
					</h1>
					<p className='text-zinc-500 font-medium'>
						Managing content for region:{" "}
						<span className='text-primary font-bold'>
							{locale.toUpperCase()}
						</span>
					</p>
				</div>
				<div className='hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm'>
					<div className='w-2 h-2 rounded-full bg-emerald-500' />
					<span className='text-[10px] font-black uppercase text-zinc-400'>
						System Active: {new Date().getFullYear()}
					</span>
				</div>
			</header>

			<BlogFormContainer
				initialData={blogs}
				locale={locale}
				availableCategories={availableCategories}
				availableTags={availableTags}
			/>
		</div>
	);
}
