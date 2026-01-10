/** @format */
"use client";

import { useEffect, useTransition } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { _Translator, useTranslations } from "next-intl"; // Added
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
import { cn } from "@/lib/utils";
import { RecordType } from "zod/v3";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";

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
	const t = useTranslations("BlogForm"); // Make sure to add this namespace to your JSON
	const [internalPending, startTransition] = useTransition();
	const isPending = externalPending || internalPending;
	const mounted = useIsMounted();
	const isRtl = locale === "ar";

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
			categoryIds: [],
			tagIds: [],
			newTags: [],
			metaTitle: "",
			metaDesc: "",
		},
	});

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
				id: selectedBlog.id,
				slug: selectedBlog.slug,
				image: selectedBlog.image,
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
	}, [selectedBlog, form]);
	const submit = (values: BlogFormValues) => {
		startTransition(async () => {
			await onSubmit(values);
			form.reset();
		});
	};

	if (!mounted)
		return <div className='h-125 animate-pulse bg-muted rounded-3xl' />;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit)}
				className={cn("space-y-6", isRtl && "text-right")}>
				<Tabs defaultValue='content' className='w-full'>
					<TabsList className='grid w-full grid-cols-4 mb-6 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl'>
						<TabsTrigger value='content' className='rounded-lg'>
							<Type className={cn("w-4 h-4")} /> {t("tabs.text")}
						</TabsTrigger>
						<TabsTrigger value='taxonomy' className='rounded-lg'>
							<LayoutGrid className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
							{t("tabs.taxonomy")}
						</TabsTrigger>
						<TabsTrigger value='media' className='rounded-lg'>
							<ImagePlus className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
							{t("tabs.media")}
						</TabsTrigger>
						<TabsTrigger value='seo' className='rounded-lg'>
							<Search className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
							{t("tabs.seo")}
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
								label={t("labels.title")}>
								{(field) => (
									<Input placeholder={t("placeholders.title")} {...field} />
								)}
							</FormFieldWrapper>
							<FormFieldWrapper
								control={form.control}
								name='slug'
								label={t("labels.slug")}>
								{(field) => (
									<Input
										placeholder='url-slug-here'
										{...field}
										className='text-left'
										dir='ltr'
									/>
								)}
							</FormFieldWrapper>
						</div>
						<FormFieldWrapper
							control={form.control}
							name='excerpt'
							label={t("labels.excerpt")}>
							{(field) => (
								<Textarea
									rows={2}
									placeholder={t("placeholders.excerpt")}
									{...field}
								/>
							)}
						</FormFieldWrapper>
						<FormFieldWrapper
							control={form.control}
							name='content'
							label='Article Body'>
							{(field) => (
								<RichTextEditor value={field.value} onChange={field.onChange} />
							)}
						</FormFieldWrapper>
						{/* <FormFieldWrapper
							control={form.control}
							name='content'
							label={t("labels.content")}>
							{(field) => (
								<Textarea
									rows={12}
									className='font-mono'
									placeholder={t("placeholders.content")}
									{...field}
								/>
							)}
						</FormFieldWrapper> */}
					</TabsContent>

					{/* TAXONOMY TAB */}
					<TabsContent
						value='taxonomy'
						className='space-y-8 animate-in fade-in'>
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<FormLabel className='text-base font-bold'>
									{t("labels.category")} *
								</FormLabel>
								<Badge variant='outline' className='text-[10px] uppercase'>
									{t("info.oneCategory")}
								</Badge>
							</div>
							<div className='flex flex-wrap gap-2 p-4 border-2 border-dashed rounded-3xl bg-muted/5 min-h-[80px]'>
								{availableCategories.map((cat) => {
									const isSelected = form.watch("categoryIds")?.[0] === cat.id;
									return (
										<Badge
											key={cat.id}
											variant={isSelected ? "default" : "outline"}
											className='cursor-pointer px-4 py-2 rounded-xl transition-all'
											onClick={() =>
												form.setValue(
													"categoryIds",
													isSelected ? [] : [cat.id],
													{ shouldDirty: true, shouldValidate: true },
												)
											}>
											{cat.name}
											{isSelected && (
												<X className={cn("w-3 h-3", isRtl ? "mr-2" : "ml-2")} />
											)}
										</Badge>
									);
								})}
							</div>
						</div>

						<Separator className='opacity-50' />

						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<FormLabel className='text-base font-bold'>
									{t("labels.tags")}
								</FormLabel>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-7 rounded-full text-[10px] uppercase font-bold'
									onClick={() => appendTag({ name: "" })}>
									<Plus className={cn("w-3 h-3")} /> {t("buttons.newTag")}
								</Button>
							</div>
							<div className='flex flex-wrap gap-2 p-4 border rounded-2xl min-h-25 bg-zinc-50/50 dark:bg-zinc-900/50'>
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
								{tagFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-1 bg-primary/10 pl-3 pr-1 py-1 rounded-lg border border-primary/20'>
										<input
											{...form.register(`newTags.${index}.name`)}
											className='bg-transparent text-xs font-bold outline-none w-20'
											placeholder={t("placeholders.newTag")}
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
						<BlogImageUploader form={form} t={t} isRtl={isRtl} />
					</TabsContent>

					{/* SEO TAB */}
					<TabsContent value='seo' className='space-y-4 animate-in fade-in'>
						<div className='p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3'>
							<Globe className='w-5 h-5 text-blue-500 shrink-0' />
							<p className='text-xs text-blue-700 dark:text-blue-300'>
								{t("info.seo")}
							</p>
						</div>
						<FormFieldWrapper
							control={form.control}
							name='metaTitle'
							label={t("labels.metaTitle")}>
							{(field) => (
								<Input
									placeholder={t("placeholders.metaTitle")}
									{...field}
									value={field.value ?? ""}
								/>
							)}
						</FormFieldWrapper>
						<FormFieldWrapper
							control={form.control}
							name='metaDesc'
							label={t("labels.metaDesc")}>
							{(field) => (
								<Textarea
									placeholder={t("placeholders.metaDesc")}
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
							<Save className={cn("w-5 h-5", isRtl ? "ml-2" : "mr-2")} />
						)}
						{selectedBlog ? t("buttons.save") : t("buttons.publish")}
					</Button>
					<div className='flex flex-col items-center justify-center px-4 border rounded-xl bg-muted/30'>
						<span className='text-[10px] font-bold uppercase text-muted-foreground'>
							{t("labels.status")}
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
type BlogFormTranslations = ReturnType<typeof useTranslations<"BlogForm">>;
function BlogImageUploader({
	form,
	t,
	isRtl,
}: {
	form: UseFormReturn<BlogFormValues>;
	t: BlogFormTranslations;
	isRtl: boolean;
}) {
	const image = form.watch("image");
	return (
		<div className='space-y-4'>
			<FormLabel className='text-base font-bold'>
				{t("labels.featuredImage")}
			</FormLabel>
			<div className='group relative p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-900 transition-colors hover:border-primary/50'>
				{image ? (
					<div className='relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl'>
						<Image src={image} fill className='object-cover' alt='Preview' />
						<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
							<Button
								type='button'
								variant='destructive'
								onClick={() => form.setValue("image", "")}>
								<Trash2 className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />{" "}
								{t("buttons.removeImage")}
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
							{t("info.imageSize")}
						</p>
					</>
				)}
			</div>
		</div>
	);
}
