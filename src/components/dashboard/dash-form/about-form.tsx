/** @format */
"use client";

import React, { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Plus,
	Trash2,
	ShieldCheck,
	Zap,
	Loader2,
	BarChart3,
	TextQuote,
	Save,
	Languages,
	X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { cn } from "@/lib/utils";
import { AboutFormValues, aboutSchema } from "@/server/validations";

import { Locale } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AboutData } from "@/types";
import { updateAboutAction } from "@/server/actions/setting";
import { IconPicker } from "@/components/icon-picker";

interface Props {
	aboutData: AboutData | null;
	locale: Locale;
}

export const AboutForm = ({ aboutData, locale }: Props) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();
	const form = useForm<AboutFormValues>({
		resolver: zodResolver(aboutSchema),
		defaultValues: {
			id: aboutData?.id ?? null,
			locale: locale as Locale,
			title: aboutData?.content?.title ?? "",
			subtitle: aboutData?.content?.subtitle ?? "",
			description: aboutData?.content?.description ?? "",
			// Ensure these are at least empty arrays
			corePillars:
				aboutData?.pillars?.map((p) => ({
					id: p.id,
					icon: p.icon ?? "Zap",
					locale: locale as Locale,
					title: p.title,
					description: p.description,
				})) ?? [],
			statuses:
				aboutData?.statuses?.map((s) => ({
					...s,
					isActive: s.isActive ?? true,
					icon: s.icon ?? "",
					locale: locale as Locale,
				})) ?? [],
		},
	});

	React.useEffect(() => {
		if (!aboutData) return;

		form.reset({
			id: aboutData.id,
			locale,
			title: aboutData.content.title,
			subtitle: aboutData.content.subtitle,
			description: aboutData.content.description,
			corePillars: aboutData.pillars,
			statuses: aboutData.statuses,
		});
	}, [aboutData, locale, form]);

	const {
		fields: pillarFields,
		append: appendPillar,
		remove: removePillar,
	} = useFieldArray({ control: form.control, name: "corePillars" });

	const {
		fields: statusFields,
		append: appendStatus,
		remove: removeStatus,
	} = useFieldArray({ control: form.control, name: "statuses" });

	const onLanguageChange = (newLocale: string) => {
		const params = new URLSearchParams(searchParams.toString());

		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(`${newPath}?${params.toString()}`);
	};
	const onSubmit = async (values: AboutFormValues) => {
		startTransition(async () => {
			const result = await updateAboutAction(values);
			if (result.success) {
				toast.success(
					locale === "ar" ? "تم الحفظ بنجاح" : "Hero saved successfully",
				);
				router.refresh();
			} else {
				toast.error(result.error);
			}
		});
	};

	if (Object.keys(form.formState.errors).length > 0) {
		console.log("Form Validation Errors:", form.formState.errors);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 pb-24 max-w-7xl mx-auto'>
				{/* --- STICKY HEADER --- */}
				<header className='sticky top-4 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5'>
					<div className='flex items-center gap-4'>
						<div className='p-3 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-2xl ring-1 ring-indigo-600/20'>
							<ShieldCheck
								className='text-indigo-600 dark:text-indigo-400'
								size={24}
							/>
						</div>
						<div>
							<h2 className='text-lg font-bold tracking-tight'>
								About Management
							</h2>
							<p className='text-[10px] text-zinc-500 font-mono uppercase tracking-widest'>
								ID: {aboutData?.id || "NEW_ENTRY"} • {locale}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<Button
							disabled={isPending}
							type='submit'
							className='rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20'>
							{isPending ? (
								<Loader2 className='mr-2 animate-spin' size={18} />
							) : (
								<Save className='mr-2' size={18} />
							)}
							{locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
						</Button>
					</div>
				</header>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					{/* --- SIDEBAR --- */}
					<aside className='lg:col-span-4 space-y-6'>
						{/* Language Card */}
						<div className='bg-white dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm'>
							<div className='flex items-center gap-2 mb-4'>
								<Languages size={18} className='text-indigo-500' />
								<h3 className='text-xs font-bold uppercase tracking-widest text-zinc-400'>
									Localization
								</h3>
							</div>
							<FormFieldWrapper control={form.control} name='locale'>
								{(field) => (
									<Select
										onValueChange={(val) => {
											field.onChange(val);
											onLanguageChange(val);
										}}
										value={field.value}>
										<SelectTrigger className='h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'>
											<SelectValue placeholder='Select Language' />
										</SelectTrigger>
										<SelectContent className='rounded-xl'>
											<SelectItem value='en'>English (US)</SelectItem>
											<SelectItem value='ar'>Arabic (العربية)</SelectItem>
										</SelectContent>
									</Select>
								)}
							</FormFieldWrapper>
						</div>

						{/* Metrics Live Preview */}
						<div className='bg-zinc-900 dark:bg-zinc-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group'>
							<div className='absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform'>
								<BarChart3 size={120} />
							</div>
							<div className='relative z-10'>
								<div className='flex items-center justify-between mb-6'>
									<h3 className='text-xs font-bold opacity-60 tracking-widest'>
										LIVE ANALYTICS
									</h3>
									<div className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
								</div>
								<div className='grid grid-cols-2 gap-3'>
									{statusFields.map((f, i) => (
										<div
											key={f.id}
											className='bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10'>
											<p className='text-[10px] opacity-50 truncate uppercase font-medium'>
												{form.watch(`statuses.${i}.label`) || "Stat"}
											</p>
											<p className='text-xl font-bold text-indigo-400 mt-1'>
												{form.watch(`statuses.${i}.value`) || "0"}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</aside>

					{/* --- MAIN CONTENT --- */}
					<main className='lg:col-span-8 space-y-6'>
						{/* General Information */}
						<section className='bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm'>
							<div className='flex items-center gap-3 mb-8'>
								<div className='h-8 w-1.5 bg-indigo-600 rounded-full' />
								<h3 className='font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-200'>
									Core Narrative
								</h3>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<FormFieldWrapper
									control={form.control}
									name='title'
									label='Main Heading'>
									{(field) => (
										<Input
											{...field}
											placeholder='Our Story'
											className='h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus:ring-indigo-500/20'
										/>
									)}
								</FormFieldWrapper>
								<FormFieldWrapper
									control={form.control}
									name='subtitle'
									label='Subtitle'>
									{(field) => (
										<Input
											{...field}
											value={field.value ?? ""}
											placeholder='The journey of excellence'
											className='h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900'
										/>
									)}
								</FormFieldWrapper>
							</div>

							<FormFieldWrapper
								control={form.control}
								name='description'
								label='Detailed Biography'>
								{(field) => (
									<div className='relative'>
										<Textarea
											{...field}
											className='min-h-[200px] rounded-3xl resize-none bg-zinc-50 dark:bg-zinc-900 p-6 focus:ring-indigo-500/20 border-zinc-200 dark:border-zinc-800'
											placeholder='Tell your professional story...'
										/>
										<TextQuote
											className='absolute bottom-6 right-6 opacity-5 pointer-events-none'
											size={48}
										/>
									</div>
								)}
							</FormFieldWrapper>
						</section>

						{/* Dynamic Stats Section */}
						<section className='bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm'>
							<div className='flex items-center justify-between mb-8'>
								<div className='flex items-center gap-3'>
									<div className='h-8 w-1.5 bg-orange-500 rounded-full' />
									<h3 className='font-bold text-lg tracking-tight'>
										Key Statistics
									</h3>
								</div>
								<Button
									type='button'
									variant='outline'
									onClick={() =>
										appendStatus({
											label: "",
											value: "",
											locale,
											isActive: true,
											icon: "",
										})
									}
									className='rounded-full h-10 border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'>
									<Plus size={16} className='mr-2' /> Add Metric
								</Button>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{statusFields.map((field, index) => (
									<div
										key={field.id}
										className='group relative p-5 border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-orange-500/30 transition-colors'>
										<button
											type='button'
											onClick={() => removeStatus(index)}
											className='absolute -top-2 -right-2 p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 rounded-full border border-zinc-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-all shadow-sm'>
											<X size={14} />
										</button>
										<div className='grid grid-cols-3 gap-4'>
											<div className='col-span-1'>
												<FormFieldWrapper
													control={form.control}
													name={`statuses.${index}.value`}
													label='Value'>
													{(f) => (
														<Input
															{...f}
															placeholder='10k'
															className='h-12 rounded-xl font-bold text-orange-600 bg-white dark:bg-zinc-950'
														/>
													)}
												</FormFieldWrapper>
											</div>
											<div className='col-span-2'>
												<FormFieldWrapper
													control={form.control}
													name={`statuses.${index}.label`}
													label='Label'>
													{(f) => (
														<Input
															{...f}
															placeholder='Active Users'
															className='h-12 rounded-xl bg-white dark:bg-zinc-950'
														/>
													)}
												</FormFieldWrapper>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>

						{/* Core Pillars Section */}
						<section className='bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm'>
							<div className='flex items-center justify-between mb-8'>
								<div className='flex items-center gap-3'>
									<div className='h-8 w-1.5 bg-emerald-500 rounded-full' />
									<h3 className='font-bold text-lg tracking-tight'>
										Philosophy & Pillars
									</h3>
								</div>
								<Button
									type='button'
									variant='outline'
									onClick={() =>
										appendPillar({
											title: "",
											description: "",
											icon: "Zap",
											locale,
										})
									}
									className='rounded-full h-10 border-dashed border-zinc-300'>
									<Plus size={16} className='mr-2' /> Add Pillar
								</Button>
							</div>

							<div className='space-y-4'>
								{pillarFields.map((field, index) => (
									<div
										key={field.id}
										className='relative group p-6 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md'>
										<button
											type='button'
											onClick={() => removePillar(index)}
											className='absolute top-6 right-6 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all'>
											<Trash2 size={20} />
										</button>

										<div className='shrink-0 flex items-center justify-center'>
											<IconPicker
												value={form.watch(`corePillars.${index}.icon`) || "Zap"}
												onChange={(v) =>
													form.setValue(`corePillars.${index}.icon`, v)
												}
											/>
										</div>

										<div className='flex-1 space-y-2'>
											<FormFieldWrapper
												control={form.control}
												name={`corePillars.${index}.title`}>
												{(f) => (
													<Input
														{...f}
														placeholder='Pillar Title'
														className='font-bold border-none bg-transparent text-xl h-auto p-0 focus-visible:ring-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700'
													/>
												)}
											</FormFieldWrapper>
											<FormFieldWrapper
												control={form.control}
												name={`corePillars.${index}.description`}>
												{(f) => (
													<Textarea
														{...f}
														placeholder='Describe this core value...'
														className='bg-transparent border-none resize-none min-h-[60px] p-0 focus-visible:ring-0 text-zinc-500'
													/>
												)}
											</FormFieldWrapper>
										</div>
									</div>
								))}
							</div>
						</section>
					</main>
				</div>
			</form>
		</Form>
	);
};

// Helper internal component for X icon
