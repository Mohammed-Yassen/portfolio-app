/** @format */
"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Pencil,
	Trash2,
	Plus,
	Loader2,
	Save,
	Languages,
	Briefcase,
	ChevronRight,
	Layers,
	MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Locale } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { experienceSchema, ExperienceFormValue } from "@/server/validations";
import { TransformedExperience } from "@/types";
import {
	deleteExperienceAction,
	upsertExperienceAction,
} from "@/server/actions/setting";

interface Props {
	initialData: TransformedExperience[];
	locale: Locale;
}

export function ExperienceForm({ initialData, locale }: Props) {
	const [isPending, startTransition] = useTransition();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const form = useForm<ExperienceFormValue>({
		resolver: zodResolver(experienceSchema) as never,
		defaultValues: {
			id: null,
			companyName: "",
			companyLogo: "",
			companyWebsite: "",
			location: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
			isCurrent: false,
			locale: locale,
			role: "",
			employmentType: "",
			description: "",
			techniques: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "techniques",
	});

	const onEdit = (exp: TransformedExperience) => {
		setEditingId(exp.id);

		// Since TransformedExperience already has flattened fields for the active locale,
		// we use them directly, falling back to the translations array only if needed.
		form.reset({
			id: exp.id,
			companyName: exp.companyName,
			companyLogo: exp.companyLogo ?? "",
			companyWebsite: exp.companyWebsite ?? "",
			location: exp.location ?? "",
			startDate: new Date(exp.startDate).toISOString().split("T")[0],
			endDate: exp.endDate
				? new Date(exp.endDate).toISOString().split("T")[0]
				: "",
			isCurrent: exp.isCurrent,
			locale: locale,
			role: exp.role,
			employmentType: exp.employmentType ?? "",
			description: exp.description ?? "",
			techniques: exp.techniques.map((tech) => ({
				id: tech.id,
				name: tech.name,
				icon: tech.icon ?? "Layers",
			})),
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const onSubmit = async (values: ExperienceFormValue) => {
		startTransition(async () => {
			const result = await upsertExperienceAction(values);
			if (result.success) {
				toast.success(editingId ? "Experience updated" : "Experience added");
				onCancel();
				router.refresh();
			} else {
				toast.error(result.error || "Failed to save");
			}
		});
	};

	const onCancel = () => {
		setEditingId(null);
		form.reset({
			id: null,
			companyName: "",
			companyLogo: "",
			companyWebsite: "",
			location: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
			isCurrent: false,
			locale: locale,
			role: "",
			employmentType: "",
			description: "",
			techniques: [],
		});
	};
	const onLanguageChange = (newLocale: string) => {
		const params = new URLSearchParams(searchParams.toString());

		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(`${newPath}?${params.toString()}`);
	};
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this experience?")) return;

		setDeletingId(id); // Set the specific ID being deleted
		startTransition(async () => {
			const result = await deleteExperienceAction(id);
			if (result.success) {
				toast.success("Experience deleted successfully");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete");
			}
			setDeletingId(null); // Reset after finish
		});
	};
	return (
		<div className='space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card rounded-[1.5rem] border border-border shadow-sm'>
				<div className='flex items-center gap-4'>
					<div className='p-3 bg-primary/10 rounded-xl text-primary'>
						<Briefcase size={24} />
					</div>
					<div>
						<h2 className='text-xl font-bold tracking-tight'>Career Journey</h2>
						<p className='text-sm text-muted-foreground'>
							Manage your professional work history
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

			<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
				{/* Form Section */}
				<div className='lg:col-span-7'>
					<Card className='rounded-3xl shadow-sm border-primary/10'>
						<CardHeader className='border-b bg-muted/20 rounded-t-3xl'>
							<CardTitle className='text-lg flex items-center gap-2'>
								{editingId ? (
									<Pencil className='w-4 h-4' />
								) : (
									<Plus className='w-4 h-4' />
								)}
								{editingId ? "Edit Position" : "Add New Role"}
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-8'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='companyName'
											label='Company'>
											{(field) => (
												<Input placeholder='e.g. Acme Corp' {...field} />
											)}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='role'
											label='Job Title'>
											{(field) => (
												<Input placeholder='Senior Frontend Dev' {...field} />
											)}
										</FormFieldWrapper>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='startDate'
											label='From'>
											{(field) => <Input type='date' {...field} />}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='endDate'
											label='To'>
											{(field) => (
												<Input
													type='date'
													disabled={form.watch("isCurrent")}
													{...field}
													value={field.value ?? ""}
												/>
											)}
										</FormFieldWrapper>
										<div className='flex flex-col items-center justify-end pb-2 gap-2'>
											<span className='text-[10px] font-bold uppercase text-muted-foreground'>
												Present
											</span>
											<Switch
												checked={form.watch("isCurrent")}
												onCheckedChange={(val) =>
													form.setValue("isCurrent", val)
												}
											/>
										</div>
									</div>

									<FormFieldWrapper
										control={form.control}
										name='description'
										label='Description'>
										{(field) => (
											<Textarea
												rows={4}
												className='resize-none'
												{...field}
												value={field.value ?? ""}
											/>
										)}
									</FormFieldWrapper>

									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<h3 className='text-sm font-bold flex items-center gap-2'>
												<Layers className='w-4 h-4' /> Stack & Tech
											</h3>
											<Button
												type='button'
												variant='secondary'
												size='sm'
												onClick={() => append({ name: "", icon: "Layers" })}>
												<Plus className='w-4 h-4 mr-1' /> Add Item
											</Button>
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
											{fields.map((field, index) => (
												<div
													key={field.id}
													className='group flex items-end gap-2 p-3 border rounded-2xl bg-muted/10'>
													<div className='flex-1'>
														<FormFieldWrapper
															control={form.control}
															name={`techniques.${index}.name`}
															label='Name'>
															{(f) => <Input {...f} className='h-8 text-xs' />}
														</FormFieldWrapper>
													</div>
													<div className='w-12'>
														<IconPicker
															value={
																form.watch(`techniques.${index}.icon`) ??
																"Layers"
															}
															onChange={(val) =>
																form.setValue(`techniques.${index}.icon`, val)
															}
														/>
													</div>
													<Button
														type='button'
														variant='ghost'
														size='icon'
														className='h-8 w-8 text-destructive'
														onClick={() => remove(index)}>
														<Trash2 size={14} />
													</Button>
												</div>
											))}
										</div>
									</div>

									<div className='flex gap-3'>
										<Button
											disabled={isPending}
											type='submit'
											className='flex-1 rounded-xl h-12'>
											{isPending ? (
												<Loader2 className='animate-spin' />
											) : (
												<Save className='mr-2 w-4 h-4' />
											)}
											{editingId ? "Update Record" : "Save Experience"}
										</Button>
										{editingId && (
											<Button
												type='button'
												variant='outline'
												onClick={onCancel}
												className='rounded-xl h-12 px-8'>
												Cancel
											</Button>
										)}
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>

				{/* List Section */}
				<div className='lg:col-span-5'>
					<ScrollArea className='h-200 pr-4'>
						<div className='space-y-4'>
							{initialData.map((exp) => (
								<Card
									key={exp.id}
									className={`relative overflow-hidden transition-all duration-300 ${
										editingId === exp.id
											? "border-primary bg-primary/2 ring-1 ring-primary/20"
											: "hover:shadow-md"
									}`}>
									<div className='p-5'>
										<div className='flex justify-between items-start'>
											<div className='space-y-1'>
												<h4 className='font-black text-lg leading-tight'>
													{exp.companyName}
												</h4>
												<p className='text-primary font-semibold text-sm'>
													{exp.role}
												</p>
												<div className='flex items-center gap-3 text-[11px] text-muted-foreground font-medium pt-1'>
													<span className='flex items-center gap-1'>
														<MapPin size={12} /> {exp.location || "N/A"}
													</span>
													<span>•</span>
													<span>
														{new Date(exp.startDate).getFullYear()} -{" "}
														{exp.isCurrent
															? "Present"
															: exp.endDate
															? new Date(exp.endDate).getFullYear()
															: ""}
													</span>
												</div>
											</div>
											<div className='flex gap-1'>
												<Button
													size='icon'
													variant='ghost'
													className='h-8 w-8'
													onClick={() => onEdit(exp)}>
													<Pencil size={14} />
												</Button>
												<Button
													size='icon'
													variant='ghost'
													className='h-8 w-8 text-destructive'
													onClick={() => {
														handleDelete(exp.id);
													}}>
													<Trash2 size={14} />
												</Button>
											</div>
										</div>

										<div className='mt-4 flex flex-wrap gap-1.5'>
											{exp.techniques.map((tech) => (
												<Badge
													key={tech.id}
													variant='secondary'
													className='text-[10px] py-0 h-5 font-normal bg-primary/5 text-primary border-none'>
													{tech.name}
												</Badge>
											))}
										</div>
									</div>
								</Card>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
