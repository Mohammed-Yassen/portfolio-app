/** @format */
"use client";

import { useEffect, useMemo } from "react";
import {
	useForm,
	useFieldArray,
	Control,
	FieldPath,
	FieldValues,
	UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Plus,
	Loader2,
	Save,
	Settings,
	Cpu,
	ImagePlus,
	Link as LinkIcon,
	FileText,
	LayoutGrid,
	Trash2,
	X,
} from "lucide-react";
import { Locale, ProjectCategory } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import { FormFieldWrapper } from "@/components/input-form-wrapper";
import {
	ProjectFormValues,
	ProjectSchema,
} from "@/server/validations/project-validation";
import { UploadButton } from "@/utils/uploadthing";
import { TransformedProject } from "@/types/project-types";
import { IconPicker } from "@/components/icon-picker";
import { useIsMounted } from "@/app/hooks/is-mounted";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";

interface ProjectFormProps {
	locale: Locale;
	availableTags: { id: string; name: string }[];
	availableTechniques: { id: string; name: string }[];
	selectedProject: TransformedProject | null;
	onSubmit: (values: ProjectFormValues) => Promise<void>;
	isExternalPending: boolean;
}

const getEmptyValues = (locale: Locale): ProjectFormValues => ({
	id: null,
	slug: "",
	title: "",
	description: "",
	content: "",
	locale,
	mainImage: "",
	category: ProjectCategory.WEB_DEVELOPMENT,
	tagIds: [],
	techniqueIds: [],
	newTags: [],
	newTechniques: [],
	isFeatured: false,
	isActive: true,
	gallery: [],
	liveUrl: "",
	repoUrl: "",
});

export function ProjectForm({
	locale,
	availableTags,
	availableTechniques,
	selectedProject,
	onSubmit,
	isExternalPending,
}: ProjectFormProps) {
	const mounted = useIsMounted();

	const defaultValues = useMemo(() => {
		if (selectedProject) {
			return {
				...selectedProject,
				content: selectedProject.content || "",
				tagIds: selectedProject.tags.map((t) => t.id),
				techniqueIds: selectedProject.techniques.map((t) => t.id),
				newTags: [],
				newTechniques: [],
			};
		}
		return getEmptyValues(locale);
	}, [selectedProject, locale]);

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(ProjectSchema) as never,
		defaultValues: defaultValues as ProjectFormValues,
		// mode: "onChange",
	});

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

	useEffect(() => {
		form.reset(defaultValues as ProjectFormValues);
	}, [defaultValues, form]);

	const handleFormSubmit = async (values: ProjectFormValues) => {
		try {
			await onSubmit(values);
			if (!values.id) {
				form.reset(getEmptyValues(locale));
			} else {
				form.setValue("newTags", []);
				form.setValue("newTechniques", []);
			}
		} catch (error) {
			console.error("Submission Error:", error);
		}
	};

	if (!mounted)
		return <div className='h-96 animate-pulse bg-muted rounded-xl' />;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className='space-y-6'>
				<Tabs defaultValue='general' className='w-full'>
					<TabsList className='grid w-full grid-cols-5 mb-8'>
						<TabTriggerItem
							value='general'
							icon={<Settings className='w-4 h-4' />}
							label='Basic'
						/>
						<TabTriggerItem
							value='techniques'
							icon={<Cpu className='w-4 h-4' />}
							label='Tech'
						/>
						<TabTriggerItem
							value='media'
							icon={<ImagePlus className='w-4 h-4' />}
							label='Media'
						/>
						<TabTriggerItem
							value='links'
							icon={<LinkIcon className='w-4 h-4' />}
							label='Links'
						/>
						<TabTriggerItem
							value='content'
							icon={<FileText className='w-4 h-4' />}
							label='Story'
						/>
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
						<section className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='text-lg font-medium'>Tags</h3>
									<p className='text-sm text-muted-foreground'>
										Select existing or create new.
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

							<div className='flex flex-wrap gap-2 p-3 border rounded-2xl bg-muted/5'>
								{availableTags.map((tag) => {
									const tagIds = form.watch("tagIds");
									const isSelected = tagIds.includes(tag.id);
									return (
										<Badge
											key={tag.id}
											variant={isSelected ? "default" : "outline"}
											className='cursor-pointer transition-all hover:bg-primary/10'
											onClick={() => {
												const nextValue = isSelected
													? tagIds.filter((id) => id !== tag.id)
													: [...tagIds, tag.id];
												form.setValue("tagIds", nextValue, {
													shouldDirty: true,
												});
											}}>
											{tag.name}
										</Badge>
									);
								})}
							</div>

							<div className='flex flex-wrap gap-2'>
								{tagFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-1 p-1 pl-3 rounded-full border bg-background focus-within:ring-2 focus-within:ring-ring'>
										<span className='text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full'>
											NEW
										</span>
										<input
											{...form.register(`newTags.${index}.name`)}
											placeholder='Tag name...'
											className='bg-transparent border-none text-sm outline-none w-28'
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='h-6 w-6 rounded-full'
											onClick={() => removeTag(index)}>
											<X className='w-3 h-3' />
										</Button>
									</div>
								))}
							</div>
						</section>

						<Separator />

						<section className='space-y-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-medium'>Techniques & Skills</h3>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => appendTech({ name: "", icon: "Code" })}>
									<Plus className='w-4 h-4 mr-2' /> Add Skill
								</Button>
							</div>

							<div className='flex flex-wrap gap-2 p-3 border rounded-2xl bg-muted/5'>
								{availableTechniques.map((tech) => {
									const techIds = form.watch("techniqueIds");
									const isSelected = techIds.includes(tech.id);
									return (
										<Badge
											key={tech.id}
											variant={isSelected ? "secondary" : "outline"}
											className='cursor-pointer'
											onClick={() => {
												const nextValue = isSelected
													? techIds.filter((id) => id !== tech.id)
													: [...techIds, tech.id];
												form.setValue("techniqueIds", nextValue, {
													shouldDirty: true,
												});
											}}>
											{tech.name}
										</Badge>
									);
								})}
							</div>

							<div className='grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar'>
								{techFields.map((field, index) => (
									<div
										key={field.id}
										className='flex items-center gap-3 p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50 group'>
										<div className='flex-1'>
											<Input
												{...form.register(`newTechniques.${index}.name`)}
												placeholder='Skill name'
												className='h-9'
											/>
										</div>
										<div className='w-32'>
											<FormField
												control={form.control}
												name={`newTechniques.${index}.icon`}
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
					</TabsContent>
				</Tabs>

				<Button
					disabled={isExternalPending}
					type='submit'
					className='w-full rounded-xl h-12'>
					{isExternalPending ? (
						<Loader2 className='animate-spin' />
					) : (
						<Save className='mr-2 w-4 h-4' />
					)}
					{isExternalPending
						? "Saving..."
						: selectedProject
						? "Update Project"
						: "Create Project"}
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
								fill
								unoptimized
								className='object-cover'
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
									fill
									unoptimized
									className='object-cover'
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
									className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100'>
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
