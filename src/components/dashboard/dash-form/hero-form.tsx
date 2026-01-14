/** @format */
"use client";

import React, { useState, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Save,
	Loader2,
	Sparkles,
	X,
	Upload,
	Languages,
	Trash2,
	Plus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// ... (your existing UI imports)
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { Switch } from "@/components/ui/switch"; // New for isActive

import { HeroFormValues, heroSchema } from "@/server/validations";
import { updateHeroAction, deleteHeroAction } from "@/server/actions/setting";
import { HeroData } from "@/types";
import { Locale } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { cn } from "@/lib/utils";

interface Props {
	initialData: HeroData | null; // If null, we are in "Create" mode
	locale: Locale;
}

export const HeroForm = ({ initialData, locale }: Props) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm<HeroFormValues>({
		resolver: zodResolver(heroSchema),
		defaultValues: {
			// id is optional in schema for new records
			id: initialData?.id,
			availability: initialData?.availability ?? "AVAILABLE",
			primaryImage: initialData?.primaryImage ?? "",
			isActive: initialData?.isActive ?? false,
			resumeUrl: initialData?.content?.resumeUrl ?? "",
			locale: locale,
			greeting: initialData?.content?.greeting ?? "",
			name: initialData?.content?.name ?? "",
			role: initialData?.content?.role ?? "",
			description: initialData?.content?.description ?? "",
			ctaText: initialData?.content?.ctaText ?? "Start a Project",
		},
	});

	const onLanguageChange = (newLocale: string) => {
		// If editing an existing hero, keep the ID in the URL or state
		const query = initialData?.id ? `?id=${initialData.id}` : "";
		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`) + query;
		router.push(newPath);
	};

	const onSubmit = async (values: HeroFormValues) => {
		startTransition(async () => {
			const result = await updateHeroAction(values);
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

	const onDelete = async () => {
		if (!initialData?.id) return;
		if (!confirm("Are you sure you want to delete this Hero?")) return;

		startTransition(async () => {
			const result = await deleteHeroAction(initialData.id);
			if (result.success) {
				toast.success("Hero deleted");
				router.push(`/${locale}/admin/hero`); // Go back to the list
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{/* --- HEADER --- */}
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm'>
					<div className='flex items-center gap-4'>
						<div className='p-3 bg-blue-500/10 rounded-2xl'>
							{initialData ? (
								<Sparkles className='text-blue-500' size={24} />
							) : (
								<Plus className='text-green-500' size={24} />
							)}
						</div>
						<div>
							<h2 className='text-xl font-bold'>
								{initialData ? "Edit Hero Section" : "Create New Hero"}
							</h2>
							<p className='text-xs text-zinc-500'>
								ID: {initialData?.id ?? "New Record"}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						{initialData && (
							<Button
								type='button'
								variant='ghost'
								onClick={onDelete}
								disabled={isPending}
								className='text-red-500 hover:bg-red-50 rounded-xl'>
								<Trash2 size={20} />
							</Button>
						)}
						<Button
							disabled={isPending}
							type='submit'
							className='rounded-2xl px-8 bg-blue-600 hover:bg-blue-700 h-12'>
							{isPending ? (
								<Loader2 className='mr-2 animate-spin' size={18} />
							) : (
								<Save className='mr-2' size={18} />
							)}
							{locale === "ar" ? "حفظ" : "Save Hero"}
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-12   gap-6'>
					<aside className=' md:col-span-4 space-y-6 '>
						{/* Status Card */}
						<div className='bg-white dark:bg-zinc-950 p-6 rounded-4xl border border-zinc-200 dark:border-zinc-800 space-y-4'>
							<h3 className='text-sm font-bold uppercase tracking-wider text-zinc-400'>
								Visibility
							</h3>
							<FormFieldWrapper
								control={form.control}
								name='isActive'
								label='Set as Active Hero'>
								{(field) => (
									<div className='flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl'>
										<span className='text-sm font-medium'>Currently Live</span>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</div>
								)}
							</FormFieldWrapper>
						</div>

						<VisualAssetsSection form={form} />

						{/* Language Selection */}
						<div className='bg-white dark:bg-zinc-950 p-6 rounded-4xl border border-zinc-200 dark:border-zinc-800 space-y-4'>
							<div className='flex items-center gap-2'>
								<Languages size={18} className='text-zinc-400' />
								<h3 className='text-sm font-bold uppercase tracking-wider'>
									Language
								</h3>
							</div>
							<FormFieldWrapper control={form.control} name='locale' label=''>
								{(field) => (
									<Select
										onValueChange={(val) => {
											field.onChange(val);
											onLanguageChange(val);
										}}
										value={field.value}>
										<SelectTrigger className='h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='en'>English</SelectItem>
											<SelectItem value='ar'>Arabic</SelectItem>
										</SelectContent>
									</Select>
								)}
							</FormFieldWrapper>
						</div>
					</aside>

					<main className='md:col-span-8 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8'>
						<div className='flex items-center gap-2 mb-8'>
							<div className='h-5 w-1 bg-blue-600 rounded-full' />
							<h3 className='font-bold uppercase tracking-widest text-sm text-zinc-500'>
								{locale === "en" ? "English Content" : "المحتوى العربي"}
							</h3>
						</div>
						<div className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormFieldWrapper
									control={form.control}
									name='availability'
									label='Availability Status'>
									{(field) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<SelectTrigger className='h-12 rounded-xl'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent className='rounded-xl'>
												<SelectItem value='AVAILABLE'>🟢 Available</SelectItem>
												<SelectItem value='BUSY'>🟠 Busy</SelectItem>
												<SelectItem value='OPEN_FOR_COMMISSION'>
													🔵 Open for Work
												</SelectItem>
												<SelectItem value='ON_LEAVE'>🔴 On Leave</SelectItem>
												<SelectItem value='UNAVAILABLE'>
													⚫ Unavailable
												</SelectItem>
												<SelectItem value='CLOSED'>⚪ Closed</SelectItem>
												<SelectItem value='OTHER'>🟣 Other</SelectItem>
											</SelectContent>
										</Select>
									)}
								</FormFieldWrapper>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormFieldWrapper
									control={form.control}
									name='greeting'
									label='Greeting Line'>
									{(field) => (
										<Input
											{...field}
											className='h-12 rounded-xl'
											placeholder='e.g., Hello, I am'
										/>
									)}
								</FormFieldWrapper>
								<FormFieldWrapper
									control={form.control}
									name='name'
									label='Display Name'>
									{(field) => (
										<Input
											{...field}
											className='h-12 rounded-xl'
											placeholder='Full Name'
										/>
									)}
								</FormFieldWrapper>
							</div>
							<FormFieldWrapper
								control={form.control}
								name='role'
								label='Professional Title'>
								{(field) => (
									<Input
										{...field}
										className='h-12 rounded-xl'
										placeholder='e.g., Software Engineer'
									/>
								)}
							</FormFieldWrapper>

							<FormFieldWrapper
								control={form.control}
								name='description'
								label='The Narrative (Bio)'>
								{(field) => (
									<Textarea
										{...field}
										className='min-h-40 rounded-2xl resize-none bg-zinc-50/50 dark:bg-zinc-900/50'
										placeholder='Write a brief introduction...'
									/>
								)}
							</FormFieldWrapper>

							<FormFieldWrapper
								control={form.control}
								name='ctaText'
								label='Call to Action Button'>
								{(field) => (
									<Input
										{...field}
										className='h-12 rounded-xl'
										placeholder="e.g., Let's Talk"
									/>
								)}
							</FormFieldWrapper>
						</div>
					</main>
				</div>
			</form>
		</Form>
	);
};

function VisualAssetsSection({
	form,
}: {
	form: UseFormReturn<HeroFormValues>;
}) {
	const [uploading, setUploading] = useState(false);
	const imageUrl = form.watch("primaryImage");

	return (
		<div className='bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] p-6 border border-zinc-200 dark:border-zinc-800 space-y-6'>
			<h3 className='text-sm font-black uppercase tracking-widest text-zinc-400 px-2'>
				Avatar Asset
			</h3>

			<FormFieldWrapper control={form.control} name='primaryImage' label=''>
				{(field) => (
					<div
						className={cn(
							"relative flex flex-col items-center justify-center min-h-70 rounded-[2rem] border-2 border-dashed transition-all",
							uploading
								? "border-blue-500 bg-blue-50/10 animate-pulse"
								: "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
						)}>
						{imageUrl ? (
							<div className='relative group'>
								<Image
									src={imageUrl}
									alt='Preview'
									width={500}
									height={500}
									className='w-48 h-48 object-cover rounded-[2rem] shadow-2xl ring-8 ring-white dark:ring-zinc-950'
								/>
								<button
									type='button'
									onClick={() => field.onChange("")}
									className='absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform'>
									<X size={16} />
								</button>
							</div>
						) : (
							<div className='flex flex-col items-center gap-4'>
								<div className='p-5 rounded-3xl bg-white dark:bg-zinc-800 shadow-sm'>
									<Upload className='text-zinc-400' size={28} />
								</div>
								<UploadButton
									endpoint='primaryImage'
									onUploadProgress={() => setUploading(true)}
									onClientUploadComplete={(res) => {
										field.onChange(res?.[0]?.url);
										setUploading(false);
										toast.success("Image uploaded!");
									}}
									appearance={{
										button:
											"bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold px-8 h-10",
										allowedContent: "hidden",
									}}
									content={{
										button: uploading ? "Uploading..." : "Select Avatar",
									}}
								/>
							</div>
						)}
					</div>
				)}
			</FormFieldWrapper>
		</div>
	);
}
