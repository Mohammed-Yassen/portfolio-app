/** @format */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@prisma/client";
import { BookOpen, Pencil, Trash2, PlusCircle, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransformedBlog } from "@/types/blog-types";
import { BlogForm } from "./blog-form";
import { BlogFormValues } from "@/server/validations/blog-validation";
import {
	createBlogAction,
	deleteBlogAction,
	updateBlogAction,
} from "@/server/actions/blog-actions";

interface Props {
	initialData: TransformedBlog[];
	locale: Locale;
	availableCategories: { id: string; name: string }[];
	availableTags: { id: string; name: string }[];
}

export const BlogFormContainer = ({
	initialData,
	locale,
	availableCategories,
	availableTags,
}: Props) => {
	const router = useRouter();
	const [selectedBlog, setSelectedBlog] = useState<TransformedBlog | null>(
		null,
	);
	const [isPending, startTransition] = useTransition();

	const handleOnSubmit = async (values: BlogFormValues) => {
		startTransition(async () => {
			const result = values.id
				? await updateBlogAction(values.id, values)
				: await createBlogAction(values);

			if (result.success) {
				toast.success(values.id ? "Post updated" : "Post published");
				setSelectedBlog(null);
				router.refresh();
			} else {
				toast.error("Operation failed");
			}
		});
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Permanently delete this article?")) return;

		startTransition(async () => {
			const result = await deleteBlogAction(id);
			if (result.success) {
				toast.success("Deleted successfully");
				if (selectedBlog?.id === id) setSelectedBlog(null);
				router.refresh();
			} else {
				toast.error("result.");
			}
		});
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto'>
			{/* LEFT: FORM SECTION */}
			<div className='lg:col-span-7'>
				<Card className='rounded-3xl shadow-xl border-none ring-1 ring-zinc-200 dark:ring-zinc-800 sticky top-8'>
					<CardHeader className='border-b border-zinc-100 dark:border-zinc-800 pb-4'>
						<CardTitle className='flex items-center gap-2 text-xl font-bold'>
							{selectedBlog ? (
								<>
									<Pencil className='w-5 h-5 text-blue-500' /> Edit Post
								</>
							) : (
								<>
									<PlusCircle className='w-5 h-5 text-emerald-500' /> New Post
								</>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent className='pt-6'>
						<BlogForm
							locale={locale}
							availableCategories={availableCategories}
							availableTags={availableTags}
							selectedBlog={selectedBlog}
							onSubmit={handleOnSubmit}
							isPending={isPending}
						/>
						{selectedBlog && (
							<Button
								variant='ghost'
								className='mt-4 w-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
								onClick={() => setSelectedBlog(null)}>
								Discard Edit & Create New
							</Button>
						)}
					</CardContent>
				</Card>
			</div>

			{/* RIGHT: LIST SECTION */}
			<div className='lg:col-span-5 space-y-4'>
				<div className='flex items-center justify-between px-2'>
					<h2 className='font-bold text-lg flex items-center gap-2 text-zinc-700 dark:text-zinc-300'>
						<BookOpen className='w-5 h-5 text-primary' />
						Feed ({initialData.length})
					</h2>
				</div>

				<div className='grid gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar pb-10'>
					{initialData.length === 0 ? (
						<div className='text-center py-20 border-2 border-dashed rounded-3xl border-zinc-200 dark:border-zinc-800'>
							<p className='text-zinc-400 font-medium'>
								No content found for {locale.toUpperCase()}
							</p>
						</div>
					) : (
						initialData.map((blog) => (
							<div
								key={blog.id}
								className={`group p-5 rounded-2xl border transition-all duration-200 ${
									selectedBlog?.id === blog.id
										? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
										: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
								}`}>
								<div className='flex justify-between items-start gap-4'>
									<div className='flex flex-col gap-2 overflow-hidden'>
										<h3 className='font-bold text-zinc-900 dark:text-white truncate leading-tight'>
											{blog.title}
										</h3>

										{/* CATEGORY LISTING */}
										<div className='flex flex-wrap gap-1.5 items-center'>
											<LayoutGrid className='w-3 h-3 text-zinc-400' />
											{blog?.categoryId ? (
												<span className='px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider'>
													{blog.categoryName}
												</span>
											) : (
												<span className='text-[10px] text-zinc-400 italic'>
													Uncategorized
												</span>
											)}
										</div>

										<div className='flex items-center gap-3'>
											{blog.isPublished ? (
												<span className='text-[10px] text-emerald-600 font-black flex items-center gap-1'>
													<span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />{" "}
													LIVE
												</span>
											) : (
												<span className='text-[10px] text-amber-500 font-black flex items-center gap-1'>
													<span className='w-1.5 h-1.5 rounded-full bg-amber-500' />{" "}
													DRAFT
												</span>
											)}
											<span className='text-[10px] text-zinc-400 font-medium uppercase'>
												Slug: {blog.slug}
											</span>
										</div>
									</div>

									<div className='flex gap-1 shrink-0'>
										<Button
											size='icon'
											variant='ghost'
											className='h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20'
											onClick={() => setSelectedBlog(blog)}>
											<Pencil className='w-4 h-4 text-blue-600' />
										</Button>
										<Button
											size='icon'
											variant='ghost'
											className='h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20'
											onClick={() => handleDelete(blog.id)}>
											<Trash2 className='w-4 h-4 text-red-500' />
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};
