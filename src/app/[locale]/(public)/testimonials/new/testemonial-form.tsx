/** @format */
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Star, Loader2, Linkedin, Github } from "lucide-react";
import { toast } from "sonner";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { createTestimonialAction } from "@/server/actions/testimonial";
import {
	TestimonialFormValues,
	testimonialSchema,
} from "@/server/validations/testimonial";
import { AuthUser } from "@/types/user";
import { cn } from "@/lib/utils";

export function TestimonialForm({
	user,
	locale,
}: {
	user: AuthUser;
	locale: string;
}) {
	const t = useTranslations("TestimonialForm");
	const [isPending, startTransition] = useTransition();
	const isRtl = locale === "ar";

	const form = useForm<TestimonialFormValues>({
		resolver: zodResolver(testimonialSchema) as never,
		defaultValues: {
			clientName: user.name || "",
			email: user.email || "",
			avatarUrl: user.image || "",
			rating: 5,
			content: "",
			clientTitle: "",
			linkedinUrl: "",
			githubUrl: "",
		},
	});

	const onSubmit = (values: TestimonialFormValues) => {
		startTransition(async () => {
			const result = await createTestimonialAction(values);
			if (result.error) toast.error(t("error"));
			else {
				toast.success(t("success"));
				form.reset();
			}
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 bg-white dark:bg-zinc-900/50 p-8 md:p-12 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-sm'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<FormFieldWrapper
						control={form.control}
						name='clientName'
						label={t("labelName")}
						locale={locale}>
						{(field) => (
							<Input
								{...field}
								className='h-12 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50'
								disabled={isPending}
							/>
						)}
					</FormFieldWrapper>

					<FormFieldWrapper
						control={form.control}
						name='clientTitle'
						label={t("labelTitle")}
						locale={locale}>
						{(field) => (
							<Input
								{...field}
								value={field.value ?? ""}
								placeholder={isRtl ? "  " : "Title"}
								className='h-12 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50'
								disabled={isPending}
							/>
						)}
					</FormFieldWrapper>
				</div>
				<FormFieldWrapper
					control={form.control}
					name='role'
					label={t("title")}
					locale={locale}>
					{(field) => (
						<Input
							{...field}
							value={field.value ?? ""}
							placeholder={isRtl ? "مثال: مدير تقني" : "e.g. CEO at Apple"}
							className='h-12 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50'
							disabled={isPending}
						/>
					)}
				</FormFieldWrapper>

				<FormFieldWrapper
					control={form.control}
					name='content'
					label={t("labelFeedback")}
					locale={locale}>
					{(field) => (
						<Textarea
							{...field}
							value={field.value ?? ""}
							placeholder={t("placeholderFeedback")}
							className='min-h-20 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/50 resize-none p-4 focus-visible:ring-2'
							disabled={isPending}
						/>
					)}
				</FormFieldWrapper>

				{/* Social Grouping */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{["linkedinUrl", "githubUrl"].map((name) => (
						<FormField
							key={name}
							control={form.control}
							name={name as "linkedinUrl" | "githubUrl"}
							render={({ field }) => (
								<FormItem>
									<div className='relative group'>
										<div
											className={cn(
												"absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
												isRtl ? "right-4" : "left-4",
											)}>
											{name.includes("linkedin") ? (
												<Linkedin size={18} />
											) : (
												<Github size={18} />
											)}
										</div>
										<Input
											{...field}
											value={field.value ?? ""}
											placeholder={
												name === "linkedinUrl" ? "LinkedIn" : "GitHub"
											}
											className={cn(
												"h-12 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50 transition-all",
												isRtl ? "pr-12" : "pl-12",
											)}
										/>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>

				{/* Elegant Rating Section */}
				<FormField
					control={form.control}
					name='rating'
					render={({ field }) => (
						<FormItem className='flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800'>
							<FormLabel className='mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground'>
								{isRtl ? "تقييمك الشخصي" : "Overall Rating"}
							</FormLabel>
							<FormControl>
								<div className='flex gap-3'>
									{[1, 2, 3, 4, 5].map((num) => (
										<button
											key={num}
											type='button'
											onClick={() => field.onChange(num)}
											className={cn(
												"group relative h-6 w-6 flex items-center justify-center rounded-2xl border transition-all duration-300 transform active:scale-90",
												field.value >= num
													? "bg-yellow-400 border-yellow-500 text-white shadow-[0_0_20px_rgba(250,204,21,0.3)]"
													: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-300",
											)}>
											<Star
												size={20}
												fill={field.value >= num ? "currentColor" : "none"}
												className={cn(
													"transition-transform group-hover:scale-110",
													field.value >= num &&
														"animate-in zoom-in-75 duration-300",
												)}
											/>
										</button>
									))}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isPending}
					className='group w-full h-16 rounded-[1.5rem] text-xl font-bold shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]'>
					{isPending ? (
						<Loader2 className='animate-spin' />
					) : (
						<span>{t("submit")}</span>
					)}
				</Button>
			</form>
		</Form>
	);
}
