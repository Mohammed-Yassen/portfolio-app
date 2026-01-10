/** @format */
"use client";

import { use, useEffect, useState, useTransition } from "react";
import {
	Control,
	FieldPath,
	FieldValues,
	useFieldArray,
	useForm,
	UseFormReturn,
} from "react-hook-form";
import {
	Plus,
	Loader2,
	Save,
	Settings,
	Cpu,
	ImagePlus,
	Link,
	FileText,
	LayoutGrid,
	Trash2,
	X,
} from "lucide-react";
import { Locale, ProjectCategory } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FormFieldWrapper } from "@/components/input-form-wrapper";
import {
	ProjectFormValues,
	ProjectSchema,
} from "@/server/validations/project-validation";
import { Switch } from "@/components/ui/switch";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { TransformedProject } from "@/types/project-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPicker } from "@/components/icon-picker";
import { Separator } from "@/components/ui/separator";
import { useIsMounted } from "@/app/hooks/is-mounted";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";

interface ProjectFormProps {
	locale: Locale;
	availableTags: { id: string; name: string }[];
	availableTechniques: { id: string; name: string }[];
	selectedProject: TransformedProject | null;
	onSubmit: (values: ProjectFormValues) => Promise<void>;
}

export function ProjectForm({
	locale,
	availableTags,
	availableTechniques,
	selectedProject,
	onSubmit,
}: ProjectFormProps) {
	const [isPending, startTransition] = useTransition();
	const mounted = useIsMounted();
	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(ProjectSchema) as never,
		defaultValues: {
			id: null,
			slug: "",
			mainImage: "",
			gallery: [],
			category: ProjectCategory.WEB_DEVELOPMENT,
			liveUrl: "",
			repoUrl: "",
			isFeatured: false,
			isActive: true,
			locale,
			title: "",
			description: "",
			content: "",
			tagIds: [],
			techniqueIds: [],
			newTags: [], // For manual entry
			newTechniques: [], // For manual entry
		},
	});

	// field arrays for dynamic "Add New" inputs
	const {
		fields: tagFields,
		append: appendTag,
		remove: removeTag,
	} = useFieldArray({
		control: form.control,
		name: "newTags",
	});

	const {
		fields: techFields,
		append: appendTech,
		remove: removeTech,
	} = useFieldArray({
		control: form.control,
		name: "newTechniques",
	});

	// Handle initial data load or reset
	useEffect(() => {
		if (selectedProject) {
			form.reset({
				...selectedProject,
				id: selectedProject.id,
				liveUrl: selectedProject.liveUrl ?? "",
				repoUrl: selectedProject.repoUrl ?? "",
				content: selectedProject.content ?? "",
				tagIds: selectedProject.tags.map((t) => t.id),
				techniqueIds: selectedProject.techniques.map((t) => t.id),
				newTags: [],
				newTechniques: [],
			});
		} else {
			form.reset({
				id: null,
				locale,
				slug: "",
				title: "",
				description: "",
				mainImage: "",
				category: ProjectCategory.WEB_DEVELOPMENT,
				tagIds: [],
				techniqueIds: [],
				newTags: [],
				newTechniques: [],
			});
		}
	}, [selectedProject, form, locale]);

	const handleFormSubmit = async (values: ProjectFormValues) => {
		console.log("handleFormSubmit ", values);

		startTransition(async () => {
			try {
				await onSubmit(values);
				// Optionally reset the "new" fields only after success
				form.setValue("newTags", []);
				form.setValue("newTechniques", []);
			} catch (error) {
				console.error("Submission failed", error);
			}
		});
	};
	if (!mounted) {
		// Return a skeleton or null to ensure server and
		// initial client render match (both empty)
		return <div className='h-125 animate-pulse bg-muted' />;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className='space-y-6'>
				<Tabs defaultValue='general' className='w-full'>
					<TabsList className='grid w-full grid-cols-5 mb-8'>
						<TabsTrigger value='general'>
							<Settings className='w-4 h-4 mr-2' /> Basic
						</TabsTrigger>
						<TabsTrigger value='techniques'>
							<Cpu className='w-4 h-4 mr-2' /> Tech
						</TabsTrigger>
						<TabsTrigger value='media'>
							<ImagePlus className='w-4 h-4 mr-2' /> Media
						</TabsTrigger>
						<TabsTrigger value='links'>
							<Link className='w-4 h-4 mr-2' /> Links
						</TabsTrigger>
						<TabsTrigger value='content'>
							<FileText className='w-4 h-4 mr-2' /> Story
						</TabsTrigger>
					</TabsList>

					<TabsContent value='general' className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormFieldWrapper
								control={form.control}
								name='title'
								label='Project Title'>
								{(field) => <Input placeholder='My Project' {...field} />}
							</FormFieldWrapper>
							<FormFieldWrapper
								control={form.control}
								name='slug'
								label='Slug (URL)'>
								{(field) => <Input placeholder='my-project-url' {...field} />}
							</FormFieldWrapper>
						</div>
						{/* Category Select */}
						<FormFieldWrapper
							control={form.control}
							name='category'
							label='Category'>
							{(field) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.values(ProjectCategory).map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat.replace("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</FormFieldWrapper>
						<div className='grid grid-cols-2 gap-4'>
							<StatusToggle
								control={form.control}
								name='isFeatured'
								label='Featured'
							/>

							<StatusToggle
								control={form.control}
								name='isActive'
								label='Active'
							/>
						</div>
					</TabsContent>

					<TabsContent value='techniques' className='space-y-8'>
						{/* TAGS SECTION */}
						<section className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='text-lg font-medium'>Tags</h3>
									<p className='text-sm text-muted-foreground'>
										Select from previous tags or create a new one.
									</p>
								</div>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => appendTag({ name: "" })}>
									<Plus className='w-4 h-4 mr-2' /> New Tag
								</Button>
							</div>

							{/* Pick Existing Tags (updates tagIds) */}
							<div className='flex flex-wrap gap-2 p-3 border rounded-2xl bg-muted/5'>
								{availableTags.map((tag) => {
									const isSelected = form.watch("tagIds").includes(tag.id);
									return (
										<Badge
											key={tag.id}
											variant={isSelected ? "default" : "outline"}
											className='cursor-pointer transition-all hover:bg-primary/10'
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
											{tag.name}
										</Badge>
									);
								})}
							</div>

							{/* Input Fields for New Tags (updates newTags) */}
							<div className='flex flex-wrap gap-2'>
								{tagFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-1 p-1 pl-3 rounded-full border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
										<span className='text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full'>
											NEW
										</span>
										<FormField
											control={form.control}
											name={`newTags.${index}.name`} // Updated name to match schema
											render={({ field }) => (
												<input
													{...field}
													placeholder='Tag name...'
													className='bg-transparent border-none text-sm outline-none w-28'
												/>
											)}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='h-6 w-6 rounded-full hover:text-destructive'
											onClick={() => removeTag(index)}>
											<X className='w-3 h-3' />
										</Button>
									</div>
								))}
							</div>
						</section>

						<Separator />

						{/* TECHNIQUES SECTION */}
						<section className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='text-lg font-medium'>Techniques & Skills</h3>
									<p className='text-sm text-muted-foreground'>
										Highlight the specific tools used in this project.
									</p>
								</div>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => appendTech({ name: "", icon: "Code" })}>
									<Plus className='w-4 h-4 mr-2' /> Add Skill
								</Button>
							</div>

							{/* Pick Existing Techniques (updates techniqueIds) */}
							<div className='space-y-2'>
								<label className='text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2'>
									<LayoutGrid className='w-3 h-3' /> Quick Select
								</label>
								<div className='flex flex-wrap gap-2 p-3 border rounded-2xl bg-muted/5'>
									{availableTechniques.map((tech) => {
										const isSelected = form
											.watch("techniqueIds")
											.includes(tech.id);
										return (
											<Badge
												key={tech.id}
												variant={isSelected ? "secondary" : "outline"}
												className='cursor-pointer'
												onClick={() => {
													const current = form.getValues("techniqueIds");
													form.setValue(
														"techniqueIds",
														isSelected
															? current.filter((id) => id !== tech.id)
															: [...current, tech.id],
														{ shouldDirty: true },
													);
												}}>
												{tech.name}
											</Badge>
										);
									})}
								</div>
							</div>

							{/* Dynamic List for New Techniques (updates newTechniques) */}
							<div className='grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar'>
								{techFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-3 p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50 group transition-colors hover:border-primary/50'>
										<div className='flex-1'>
											<FormField
												control={form.control}
												name={`newTechniques.${index}.name`} // Updated name to match schema
												render={({ field }) => (
													<Input
														{...field}
														placeholder='Skill name (e.g. Tailwind CSS)'
														className='h-9 bg-background'
													/>
												)}
											/>
										</div>
										<div className='w-32'>
											<FormField
												control={form.control}
												name={`newTechniques.${index}.icon`} // Updated name to match schema
												render={({ field }) => (
													<IconPicker
														value={field.value || "Code"}
														onChange={field.onChange}
													/>
												)}
											/>
										</div>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='text-muted-foreground hover:text-destructive'
											onClick={() => removeTech(index)}>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>
						</section>
					</TabsContent>
					<TabsContent value='media' className='space-y-6'>
						<ImageUploaders form={form} />
					</TabsContent>
					<Separator />
					<TabsContent value='links' className='space-y-4'>
						<FormFieldWrapper
							control={form.control}
							name='liveUrl'
							label='Live Demo URL'>
							{(field) => <Input {...field} value={field.value ?? ""} />}
						</FormFieldWrapper>
						<FormFieldWrapper
							control={form.control}
							name='repoUrl'
							label='GitHub URL'>
							{(field) => <Input {...field} value={field.value ?? ""} />}
						</FormFieldWrapper>
					</TabsContent>

					<TabsContent value='content' className='space-y-4'>
						<FormFieldWrapper
							control={form.control}
							name='description'
							label='Short Summary'>
							{(field) => <Textarea rows={3} {...field} />}
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
							label='Detailed Story (Markdown)'>
							{(field) => (
								<Textarea rows={8} {...field} value={field.value ?? ""} />
							)}
						</FormFieldWrapper> */}
					</TabsContent>
					{/* Additional TabsContent for media, links, content... */}
				</Tabs>

				<Button
					disabled={isPending}
					type='submit'
					className='w-full rounded-xl h-12'>
					{isPending ? (
						<Loader2 className='animate-spin' />
					) : (
						<Save className='mr-2 w-4 h-4' />
					)}
					{selectedProject ? "Update Project" : "Create Project"}
				</Button>
			</form>
		</Form>
	);
}

function TabTriggerItem({
	value,
	icon,
	label,
}: {
	value: string;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<TabsTrigger value={value} className='flex items-center gap-2'>
			{icon} <span className='hidden sm:inline'>{label}</span>
		</TabsTrigger>
	);
}

function StatusToggle<T extends FieldValues>({
	control,
	name,
	label,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
}) {
	return (
		<div className='flex items-center justify-between p-3 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50'>
			<span className='text-sm font-medium'>{label}</span>
			<FormField
				control={control}
				name={name}
				render={({ field }) => (
					<Switch checked={field.value} onCheckedChange={field.onChange} />
				)}
			/>
		</div>
	);
}

function ImageUploaders({ form }: { form: UseFormReturn<ProjectFormValues> }) {
	const image = form.watch("mainImage");
	const gallery = form.watch("gallery") || [];

	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<FormLabel className='text-xs font-bold uppercase text-zinc-500'>
					Cover Image
				</FormLabel>
				<div className='p-8 border-2 border-dashed rounded-3xl flex flex-col items-center gap-4 bg-zinc-50 dark:bg-zinc-900'>
					<UploadButton
						endpoint='primaryImage'
						onClientUploadComplete={(res) => {
							form.setValue("mainImage", res?.[0]?.url || "");
							toast.success("Cover uploaded");
						}}
					/>
					{image && (
						<div className='relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border shadow-lg group'>
							<Image
								src={image}
								width={1920}
								height={1080}
								unoptimized // <--- Add this!
								className='w-full h-full object-cover'
								alt='Cover'
							/>
							<Button
								size='icon'
								variant='destructive'
								className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
								onClick={() => form.setValue("mainImage", "")}>
								<Trash2 size={16} />
							</Button>
						</div>
					)}
				</div>
			</div>

			<div className='space-y-2'>
				<FormLabel className='text-xs font-bold uppercase text-zinc-500'>
					Gallery
				</FormLabel>
				<div className='p-6 border-2 border-dashed rounded-3xl bg-zinc-50 dark:bg-zinc-900'>
					<UploadButton
						endpoint='secondaryImages'
						onClientUploadComplete={(res) => {
							const urls = res?.map((r) => r.url) || [];
							form.setValue("gallery", [...gallery, ...urls]);
						}}
					/>
					<div className='grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6'>
						{gallery.map((url, idx) => (
							<div
								key={idx}
								className='relative aspect-square rounded-xl overflow-hidden border group'>
								<Image
									src={url}
									width={1920}
									height={1080}
									unoptimized // <--- Add this!
									className='w-full h-full object-cover'
									alt='Gallery'
								/>
								<button
									type='button'
									onClick={() =>
										form.setValue(
											"gallery",
											gallery.filter((_, i) => i !== idx),
										)
									}
									className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
									<X size={12} />
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
