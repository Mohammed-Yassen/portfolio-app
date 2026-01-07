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
	GraduationCap, // Changed icon
	Layers,
	MapPin,
	School,
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
import { educationSchema, EducationFormValue } from "@/server/validations";
import { TransformedEducation } from "@/types";
import {
	deleteEducationAction,
	upsertEducationAction,
} from "@/server/actions/setting";

interface Props {
	initialData: TransformedEducation[];
	locale: Locale;
}

export function EducationForm({ initialData, locale }: Props) {
	const [isPending, startTransition] = useTransition();
	const [editingId, setEditingId] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const form = useForm<EducationFormValue>({
		resolver: zodResolver(educationSchema) as never,
		defaultValues: {
			id: null,
			schoolName: "",
			schoolLogo: "",
			schoolWebsite: "",
			location: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
			isCurrent: false,
			locale: locale,
			degree: "",
			fieldOfStudy: "",
			description: "",
			techniques: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "techniques",
	});

	const onEdit = (edu: TransformedEducation) => {
		setEditingId(edu.id);
		form.reset({
			id: edu.id,
			schoolName: edu.schoolName,
			schoolLogo: edu.schoolLogo ?? "",
			schoolWebsite: edu.schoolWebsite ?? "",
			location: edu.location ?? "",
			startDate: new Date(edu.startDate).toISOString().split("T")[0],
			endDate: edu.endDate
				? new Date(edu.endDate).toISOString().split("T")[0]
				: "",
			isCurrent: edu.isCurrent,
			locale: locale,
			degree: edu.degree,
			fieldOfStudy: edu.fieldOfStudy ?? "",
			description: edu.description ?? "",
			techniques: edu.techniques.map((tech) => ({
				id: tech.id,
				name: tech.name,
				icon: tech.icon ?? "Layers",
			})),
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const onSubmit = async (values: EducationFormValue) => {
		startTransition(async () => {
			const result = await upsertEducationAction(values);
			if (result.success) {
				toast.success(editingId ? "Education updated" : "Education added");
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
			schoolName: "",
			schoolLogo: "",
			schoolWebsite: "",
			location: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
			isCurrent: false,
			locale: locale,
			degree: "",
			fieldOfStudy: "",
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
		if (!confirm("Are you sure you want to delete this education record?"))
			return;

		startTransition(async () => {
			const result = await deleteEducationAction(id);
			if (result.success) {
				toast.success("Education deleted successfully");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete");
			}
		});
	};

	return (
		<div className='space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card rounded-[1.5rem] border border-border shadow-sm'>
				<div className='flex items-center gap-4'>
					<div className='p-3 bg-primary/10 rounded-xl text-primary'>
						<GraduationCap size={24} />
					</div>
					<div>
						<h2 className='text-xl font-bold tracking-tight'>
							Education History
						</h2>
						<p className='text-sm text-muted-foreground'>
							Manage your academic qualifications and certifications
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<Select
						onValueChange={(val) => {
							form.setValue("locale", val as Locale, {
								shouldValidate: true,
								shouldDirty: true,
							});
							onLanguageChange(val);
						}}
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
								{editingId ? "Edit Qualification" : "Add New Education"}
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
											name='schoolName'
											label='Institution'>
											{(field) => (
												<Input
													placeholder='e.g. Stanford University'
													{...field}
												/>
											)}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='degree'
											label='Degree / Certificate'>
											{(field) => (
												<Input
													placeholder='e.g. Bachelor of Science'
													{...field}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='fieldOfStudy'
											label='Field of Study'>
											{(field) => (
												<Input
													placeholder='e.g. Computer Science'
													{...field}
													value={field.value ?? ""}
												/>
											)}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='location'
											label='Location'>
											{(field) => (
												<Input
													placeholder='City, Country'
													{...field}
													value={field.value ?? ""}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='startDate'
											label='Started'>
											{(field) => <Input type='date' {...field} />}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='endDate'
											label='Ended'>
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
												Current Study
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
										label='Activities / Description'>
										{(field) => (
											<Textarea
												rows={4}
												placeholder='Relevant coursework, honors, or activities...'
												className='resize-none'
												{...field}
												value={field.value ?? ""}
											/>
										)}
									</FormFieldWrapper>

									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<h3 className='text-sm font-bold flex items-center gap-2'>
												<Layers className='w-4 h-4' /> Skills & Expertise
											</h3>
											<Button
												type='button'
												variant='secondary'
												size='sm'
												onClick={() => append({ name: "", icon: "Layers" })}>
												<Plus className='w-4 h-4 mr-1' /> Add Skill
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
															label='Skill'>
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
											{editingId ? "Update Record" : "Save Education"}
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
					<ScrollArea className='h-[800px] pr-4'>
						<div className='space-y-4'>
							{initialData.map((edu) => (
								<Card
									key={edu.id}
									className={`relative overflow-hidden transition-all duration-300 ${
										editingId === edu.id
											? "border-primary bg-primary/5 ring-1 ring-primary/20"
											: "hover:shadow-md"
									}`}>
									<div className='p-5'>
										<div className='flex justify-between items-start'>
											<div className='space-y-1'>
												<h4 className='font-black text-lg leading-tight'>
													{edu.schoolName}
												</h4>
												<p className='text-primary font-semibold text-sm'>
													{edu.degree}
												</p>
												{edu.fieldOfStudy && (
													<p className='text-xs text-muted-foreground italic'>
														{edu.fieldOfStudy}
													</p>
												)}
												<div className='flex items-center gap-3 text-[11px] text-muted-foreground font-medium pt-1'>
													<span className='flex items-center gap-1'>
														<MapPin size={12} /> {edu.location || "N/A"}
													</span>
													<span>•</span>
													<span>
														{new Date(edu.startDate).getFullYear()} -{" "}
														{edu.isCurrent
															? "Present"
															: edu.endDate
															? new Date(edu.endDate).getFullYear()
															: ""}
													</span>
												</div>
											</div>
											<div className='flex gap-1'>
												<Button
													size='icon'
													variant='ghost'
													className='h-8 w-8'
													onClick={() => onEdit(edu)}>
													<Pencil size={14} />
												</Button>
												<Button
													size='icon'
													variant='ghost'
													className='h-8 w-8 text-destructive'
													onClick={() => handleDelete(edu.id)}>
													<Trash2 size={14} />
												</Button>
											</div>
										</div>
										<div className='mt-4 flex flex-wrap gap-1.5'>
											{edu.techniques.map((tech) => (
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
