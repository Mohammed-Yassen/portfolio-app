/** @format */
"use client";

import { useEffect, useTransition } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
	Plus,
	Loader2,
	Save,
	ImagePlus,
	Type,
	Tag,
	X,
	Trash2,
	Search,
	Globe,
	LayoutGrid,
} from "lucide-react";
import { Locale } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
	FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { UploadButton } from "@/utils/uploadthing";
import { useIsMounted } from "@/app/hooks/is-mounted";
import {
	BlogFormValues,
	BlogSchema,
} from "@/server/validations/blog-validation";
import { TransformedBlog } from "@/types/blog-types";

interface BlogFormProps {
	locale: Locale;
	availableCategories: { id: string; name: string }[];
	availableTags: { id: string; name: string }[];
	selectedBlog: TransformedBlog | null;
	onSubmit: (values: BlogFormValues) => Promise<void>;
	isPending?: boolean;
}
export function BlogForm({
	locale,
	availableCategories,
	availableTags,
	selectedBlog,
	onSubmit,
	isPending: externalPending,
}: BlogFormProps) {
	const [internalPending, startTransition] = useTransition();
	const isPending = externalPending || internalPending;
	const mounted = useIsMounted();

	const form = useForm<BlogFormValues>({
		resolver: zodResolver(BlogSchema) as never,
		defaultValues: {
			id: null,
			slug: "",
			title: "",
			excerpt: "",
			content: "",
			image: "",
			isPublished: false,
			locale,
			categoryIds: [], // Still an array to match Zod, but logic will restrict to 1
			tagIds: [],
			newTags: [],
			metaTitle: "",
			metaDesc: "",
		},
	});

	// We only need field array for Tags now
	const {
		fields: tagFields,
		append: appendTag,
		remove: removeTag,
	} = useFieldArray({
		control: form.control,
		name: "newTags",
	});

	useEffect(() => {
		if (selectedBlog) {
			form.reset({
				id: "",
				slug: selectedBlog.slug,
				image: selectedBlog.image,
				// If it's a single string from DB, wrap it in array for Zod
				categoryIds: selectedBlog.categoryId ? [selectedBlog.categoryId] : [],
				isPublished: selectedBlog.isPublished,
				locale: selectedBlog.locale,
				title: selectedBlog.title,
				excerpt: selectedBlog.excerpt,
				content: selectedBlog.content,
				metaTitle: selectedBlog.metaTitle || "",
				metaDesc: selectedBlog.metaDesc || "",
				tagIds: selectedBlog.tags.map((t) => t.id),
				newTags: [],
			});
		}
	}, [selectedBlog, form, locale]);

	if (!mounted)
		return <div className='h-125 animate-pulse bg-muted rounded-3xl' />;
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<Tabs defaultValue='content' className='w-full'>
					<TabsList className='grid w-full grid-cols-4 mb-6 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl'>
						<TabsTrigger value='content' className='rounded-lg'>
							<Type className='w-4 h-4 mr-2' /> Text
						</TabsTrigger>
						<TabsTrigger value='taxonomy' className='rounded-lg'>
							<LayoutGrid className='w-4 h-4 mr-2' /> Taxonomy
						</TabsTrigger>
						<TabsTrigger value='media' className='rounded-lg'>
							<ImagePlus className='w-4 h-4 mr-2' /> Media
						</TabsTrigger>
						<TabsTrigger value='seo' className='rounded-lg'>
							<Search className='w-4 h-4 mr-2' /> SEO
						</TabsTrigger>
					</TabsList>

					{/* CONTENT TAB */}
					<TabsContent
						value='content'
						className='space-y-4 animate-in fade-in slide-in-from-bottom-2'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormFieldWrapper
								control={form.control}
								name='title'
								label='Article Title'>
								{(field) => (
									<Input placeholder='The future of AI...' {...field} />
								)}
							</FormFieldWrapper>
							<FormFieldWrapper
								control={form.control}
								name='slug'
								label='URL Slug'>
								{(field) => <Input placeholder='future-of-ai' {...field} />}
							</FormFieldWrapper>
						</div>
						<FormFieldWrapper
							control={form.control}
							name='excerpt'
							label='Excerpt'>
							{(field) => (
								<Textarea rows={2} placeholder='Short summary...' {...field} />
							)}
						</FormFieldWrapper>
						<FormFieldWrapper
							control={form.control}
							name='content'
							label='Markdown Content'>
							{(field) => (
								<Textarea
									rows={12}
									className='font-mono'
									placeholder='# Start writing...'
									{...field}
								/>
							)}
						</FormFieldWrapper>
					</TabsContent>

					{/* TAXONOMY TAB (Categories & Tags as Badges) */}
					<TabsContent
						value='taxonomy'
						className='space-y-8 animate-in fade-in'>
						{/* UPDATED CATEGORIES SECTION (Single Selection Only) */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<FormLabel className='text-base font-bold'>
									Category <span className='text-destructive'>*</span>
								</FormLabel>
								<Badge variant='outline' className='text-[10px] uppercase'>
									One category only
								</Badge>
							</div>

							<div className='flex flex-wrap gap-2 p-4 border-2 border-dashed rounded-3xl bg-muted/5 min-h-[80px]'>
								{availableCategories.map((cat) => {
									// Logic: Check if this ID is the current (and only) selection
									const isSelected = form.watch("categoryIds")?.[0] === cat.id;

									return (
										<Badge
											key={cat.id}
											variant={isSelected ? "default" : "outline"}
											className='cursor-pointer px-4 py-2 rounded-xl transition-all'
											onClick={() => {
												// Logic: Replace the array with just this one ID
												form.setValue(
													"categoryIds",
													isSelected ? [] : [cat.id],
													{ shouldDirty: true, shouldValidate: true },
												);
											}}>
											{cat.name}
											{isSelected && <X className='w-3 h-3 ml-2 opacity-50' />}
										</Badge>
									);
								})}
							</div>
							{/* Error message for category */}
							{form.formState.errors.categoryIds && (
								<p className='text-xs text-destructive'>
									{form.formState.errors.categoryIds.message}
								</p>
							)}
						</div>

						<Separator className='opacity-50' />

						{/* TAGS SECTION (Multiple Selection Allowed) */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<FormLabel className='text-base font-bold'>Tags</FormLabel>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 rounded-full text-[10px] uppercase font-bold'
									onClick={() => appendTag({ name: "" })}>
									<Plus className='w-3 h-3 mr-1' /> New Tag
								</Button>
							</div>
							<div className='flex flex-wrap gap-2 p-4 border rounded-2xl min-h-[100px] bg-zinc-50/50 dark:bg-zinc-900/50'>
								{availableTags.map((tag) => {
									const isSelected = form.watch("tagIds").includes(tag.id);
									return (
										<Badge
											key={tag.id}
											variant={isSelected ? "default" : "outline"}
											className='cursor-pointer px-4 py-1.5 rounded-lg transition-all'
											onClick={() => {
												const current = form.getValues("tagIds");
												form.setValue(
													"tagIds",
													isSelected
														? current.filter((id) => id !== tag.id)
														: [...current, tag.id],
													{ shouldDirty: true },
												);
											}}>
											#{tag.name}
										</Badge>
									);
								})}
								{/* New Tag Fields Logic */}
								{tagFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-1 bg-primary/10 pl-3 pr-1 py-1 rounded-lg border border-primary/20'>
										<input
											{...form.register(`newTags.${index}.name`)}
											className='bg-transparent text-xs font-bold outline-none w-20'
											placeholder='New Tag...'
											autoFocus
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='h-5 w-5'
											onClick={() => removeTag(index)}>
											<X className='w-3 h-3' />
										</Button>
									</div>
								))}
							</div>
						</div>
					</TabsContent>
					{/* MEDIA TAB */}
					<TabsContent value='media' className='animate-in fade-in'>
						<BlogImageUploader form={form} />
					</TabsContent>

					{/* SEO TAB */}
					<TabsContent value='seo' className='space-y-4 animate-in fade-in'>
						<div className='p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3'>
							<Globe className='w-5 h-5 text-blue-500 shrink-0' />
							<p className='text-xs text-blue-700 dark:text-blue-300'>
								SEO metadata helps search engines. If empty, title and excerpt
								are used.
							</p>
						</div>
						<FormFieldWrapper
							control={form.control}
							name='metaTitle'
							label='Meta Title (SEO)'>
							{(field) => (
								<Input
									placeholder='Custom SEO Title...'
									{...field}
									value={field.value ?? ""}
								/>
							)}
						</FormFieldWrapper>
						<FormFieldWrapper
							control={form.control}
							name='metaDesc'
							label='Meta Description'>
							{(field) => (
								<Textarea
									placeholder='Custom SEO Description...'
									{...field}
									value={field.value ?? ""}
								/>
							)}
						</FormFieldWrapper>
					</TabsContent>
				</Tabs>

				<div className='flex items-center gap-4 pt-4 border-t'>
					<Button
						disabled={isPending}
						type='submit'
						className='flex-1 rounded-xl h-12 text-lg font-bold'>
						{isPending ? (
							<Loader2 className='animate-spin' />
						) : (
							<Save className='mr-2 w-5 h-5' />
						)}
						{selectedBlog ? "Save Changes" : "Publish Article"}
					</Button>
					<div className='flex flex-col items-center justify-center px-4 border rounded-xl bg-muted/30'>
						<span className='text-[10px] font-bold uppercase text-muted-foreground'>
							Status
						</span>
						<FormField
							control={form.control}
							name='isPublished'
							render={({ field }) => (
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
}

// --- SUB-COMPONENTS ---
function BlogImageUploader({ form }: { form: UseFormReturn<BlogFormValues> }) {
	const image = form.watch("image");
	return (
		<div className='space-y-4'>
			<FormLabel className='text-base font-bold'>Featured Image</FormLabel>
			<div className='group relative p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:border-primary/50'>
				{image ? (
					<div className='relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl'>
						<Image src={image} fill className='object-cover' alt='Preview' />
						<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
							<Button
								type='button'
								variant='destructive'
								onClick={() => form.setValue("image", "")}>
								<Trash2 className='w-4 h-4 mr-2' /> Remove Image
							</Button>
						</div>
					</div>
				) : (
					<>
						<UploadButton
							endpoint='primaryImage'
							onClientUploadComplete={(res) =>
								form.setValue("image", res?.[0]?.url || "")
							}
						/>
						<p className='text-xs text-muted-foreground'>
							Recommended size: 1200x630px
						</p>
					</>
				)}
			</div>
		</div>
	);
}
