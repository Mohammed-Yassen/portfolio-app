/** @format */

"use client";

import { useState, useTransition, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Pencil,
	Trash2,
	Plus,
	Loader2,
	X,
	Sparkles,
	Save,
	Languages,
	Layers,
	ChevronRight,
	AlertCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Locale } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { IconPicker } from "@/components/icon-picker";
import {
	upsertSkillCategoryAction,
	deleteSkillCategoryAction,
} from "@/server/actions/setting";
import {
	skillCategorySchema,
	SkillCategoryFormValue,
} from "@/server/validations";
import { TransformedSkillCategory } from "@/types";

interface Props {
	initialData: TransformedSkillCategory[];
	locale: Locale;
}

export function SkillsForm({ initialData, locale }: Props) {
	const [isPending, startTransition] = useTransition();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 1. Setup Form
	const form = useForm<SkillCategoryFormValue>({
		resolver: zodResolver(skillCategorySchema) as never,
		defaultValues: {
			id: null,
			title: "",
			icon: "Layers",
			order: 0,
			isActive: true,
			locale: locale,
			skills: [],
		},
	});

	const { fields, append, remove, replace } = useFieldArray({
		control: form.control,
		name: "skills",
	});

	// 2. Actions
	const onEdit = (category: TransformedSkillCategory) => {
		setEditingId(category.id);
		form.reset({
			id: category.id,
			title: category.title,
			icon: category.icon,
			order: category.order,
			isActive: category.isActive,
			locale: locale,
			skills: category.skills.map((s) => ({
				name: s.name,
				level: s.level ?? 80,
				icon: s.icon || null,
			})),
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const onCancel = () => {
		setEditingId(null);
		form.reset({
			id: null,
			title: "",
			icon: "Layers",
			order: 0,
			isActive: true,
			locale: locale,
			skills: [],
		});
	};

	const onSubmit = async (values: SkillCategoryFormValue) => {
		startTransition(async () => {
			const result = await upsertSkillCategoryAction(values);
			if (result.success) {
				toast.success(
					editingId ? "Category updated successfully" : "New category created",
				);
				onCancel();
				router.refresh();
			} else {
				toast.error(result.error || "Failed to save category");
			}
		});
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this experience?")) return;

		setDeletingId(id); // Set the specific ID being deleted
		startTransition(async () => {
			const result = await deleteSkillCategoryAction(id);
			if (result.success) {
				toast.success("Experience deleted successfully");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete");
			}
			setDeletingId(null); // Reset after finish
		});
	};
	const onLanguageChange = (newLocale: string) => {
		const params = new URLSearchParams(searchParams.toString());

		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(`${newPath}?${params.toString()}`);
	};
	return (
		<div className='space-y-6 max-w-350 mx-auto animate-in fade-in duration-500'>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card rounded-[1.5rem] border border-border shadow-sm'>
				<div className='flex items-center gap-4'>
					<div className='p-3 bg-primary/10 rounded-xl text-primary'>
						{editingId ? <Sparkles size={24} /> : <Layers size={24} />}
					</div>
					<div>
						<h2 className='text-xl font-bold tracking-tight'>
							{editingId ? "Modify Category" : "Skills Management"}
						</h2>
						<p className='text-sm text-muted-foreground'>
							{editingId
								? `Editing ID: ${editingId}`
								: "Organize your technical stack by categories"}
						</p>
					</div>
				</div>

				<div className='flex items-center gap-3'>
					<Select
						onValueChange={(val) => {
							// 1. Update the form value (use 'true' to mark the field as dirty/touched)
							form.setValue("locale", val as Locale, {
								shouldValidate: true,
								shouldDirty: true,
							});

							// 2. Trigger your UI/i18n language switch logic
							onLanguageChange(val);
						}}
						// Get the current value from the form state
						// eslint-disable-next-line react-hooks/incompatible-library
						value={form.watch("locale")}>
						<SelectTrigger className='w-32.5 rounded-xl h-11'>
							<Languages className='w-4 h-4 mr-2' />
							<SelectValue placeholder='Language' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='en'>English</SelectItem>
							<SelectItem value='ar'>Arabic</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
				{/* Left: Form Card */}
				<div className='lg:col-span-5'>
					<Card className='sticky top-6 border-primary/20 shadow-lg overflow-hidden'>
						<CardHeader className='bg-muted/30'>
							<CardTitle className='text-lg flex items-center gap-2'>
								{editingId ? (
									<Pencil className='w-4 h-4' />
								) : (
									<Plus className='w-4 h-4' />
								)}
								{editingId ? "Edit Category" : "New Category"}
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-5'>
									<div className='grid grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='title'
											label='Category Title'>
											{(field) => (
												<Input
													placeholder='e.g. Frontend'
													{...field}
													className='h-11'
												/>
											)}
										</FormFieldWrapper>

										<FormFieldWrapper
											control={form.control}
											name='icon'
											label='Icon'>
											{(field) => (
												<IconPicker
													value={field.value}
													onChange={field.onChange}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<div className='flex items-center justify-between p-3 border rounded-xl bg-muted/20'>
										<span className='text-sm font-medium'>Category Status</span>
										<FormFieldWrapper
											control={form.control}
											name='isActive'
											label=''>
											{(field) => (
												<div className='flex items-center gap-2'>
													<span className='text-xs text-muted-foreground'>
														{field.value ? "Visible" : "Hidden"}
													</span>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</div>
											)}
										</FormFieldWrapper>
									</div>

									<Separator />

									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<h3 className='text-sm font-bold flex items-center gap-2'>
												<ChevronRight className='w-4 h-4 text-primary' />
												Skills List
											</h3>
											<Button
												type='button'
												variant='secondary'
												size='sm'
												className='rounded-full'
												onClick={() =>
													append({ name: "", level: 80, icon: null })
												}>
												<Plus className='w-4 h-4 mr-1' /> Add Skill
											</Button>
										</div>

										<ScrollArea className='h-[300px] pr-4'>
											<div className='space-y-3'>
												{fields.map((field, index) => (
													<div
														key={field.id}
														className='p-4 border rounded-xl bg-card relative group/item animate-in slide-in-from-right-2'>
														<Button
															variant='ghost'
															size='icon'
															className='absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-white opacity-0 group-hover/item:opacity-100 transition-opacity'
															onClick={() => remove(index)}>
															<X className='w-3 h-3' />
														</Button>

														<div className='space-y-4'>
															<FormFieldWrapper
																control={form.control}
																name={`skills.${index}.name`}>
																{(field) => (
																	<Input
																		{...field}
																		placeholder='Skill name...'
																		className='h-9 bg-muted/30'
																	/>
																)}
															</FormFieldWrapper>

															<FormFieldWrapper
																control={form.control}
																name={`skills.${index}.level`}>
																{(field) => (
																	<div className='space-y-2'>
																		<div className='flex justify-between text-[10px] font-bold uppercase text-muted-foreground'>
																			<span>Proficiency</span>
																			<span className='text-primary'>
																				{field.value}%
																			</span>
																		</div>
																		<Slider
																			value={[field.value]}
																			onValueChange={(v) =>
																				field.onChange(v[0])
																			}
																			max={100}
																			step={5}
																		/>
																	</div>
																)}
															</FormFieldWrapper>
														</div>
													</div>
												))}
												{fields.length === 0 && (
													<div className='text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground text-sm'>
														No skills added yet.
													</div>
												)}
											</div>
										</ScrollArea>
									</div>

									<div className='flex gap-3 pt-4'>
										<Button
											disabled={isPending}
											type='submit'
											className='flex-1 h-11 rounded-xl shadow-blue-500/20 shadow-lg'>
											{isPending ? (
												<Loader2 className='animate-spin' />
											) : (
												<Save className='w-4 h-4 mr-2' />
											)}
											{editingId ? "Update Category" : "Save Category"}
										</Button>
										{editingId && (
											<Button
												type='button'
												variant='outline'
												onClick={onCancel}
												className='h-11 rounded-xl'>
												Cancel
											</Button>
										)}
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>

				{/* Right: Data Display */}
				<div className='lg:col-span-7'>
					<div className='space-y-3'>
						{initialData.length === 0 && (
							<div className='flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-[2rem] text-muted-foreground bg-muted/10'>
								<AlertCircle className='w-10 h-10 mb-2 opacity-20' />
								<p>No categories found for this locale.</p>
							</div>
						)}
						{initialData.map((cat) => {
							const Icon =
								LucideIcons[cat.icon as keyof typeof LucideIcons] || Layers;
							return (
								<Card
									key={cat.id}
									className={`group transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-md ${
										editingId === cat.id
											? "border-primary ring-1 ring-primary/20 bg-primary/5"
											: ""
									}`}>
									<div className='p-5 flex items-center justify-between'>
										<div className='flex items-center gap-4'>
											<div
												className={`p-3 rounded-xl transition-colors ${
													editingId === cat.id
														? "bg-primary text-white"
														: "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
												}`}>
												{/* <Icon size={20} /> */}
											</div>
											<div>
												<div className='flex items-center gap-2'>
													<h4 className='font-bold'>{cat.title}</h4>
													{!cat.isActive && (
														<Badge
															variant='outline'
															className='text-[10px] scale-90'>
															Hidden
														</Badge>
													)}
												</div>
												<div className='flex flex-wrap gap-1.5 mt-2'>
													{cat.skills.map((s, i) => (
														<Badge
															key={i}
															variant='secondary'
															className='bg-background border font-medium text-[10px]'>
															{s.name}{" "}
															<span className='ml-1 text-muted-foreground'>
																{s.level}%
															</span>
														</Badge>
													))}
												</div>
											</div>
										</div>

										<div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
											<Button
												variant='outline'
												size='icon'
												className='h-9 w-9 rounded-lg'
												onClick={() => onEdit(cat)}>
												<Pencil className='h-4 w-4' />
											</Button>
											<Button
												variant='outline'
												size='icon'
												className='h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive'
												onClick={() => handleDelete(cat.id)}>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
