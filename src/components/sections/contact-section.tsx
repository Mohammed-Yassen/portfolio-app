/** @format */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; // Added hooks

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "../input-form-wrapper";

import { contactFormSchema } from "@/server/validations/contact";
import { z } from "zod";
import { sendContactMessage } from "@/server/actions/contact";
import { cn } from "@/lib/utils";

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSectionForm() {
	const t = useTranslations("ContactSection");
	const locale = useLocale();
	const isAr = locale === "ar";
	const [isPending, startTransition] = React.useTransition();

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const onSubmit = (values: ContactFormValues) => {
		startTransition(async () => {
			try {
				const result = await sendContactMessage(values);

				if (result?.error) {
					toast.error(
						typeof result.error === "string" ? result.error : t("error"),
					);
					return;
				}

				toast.success(t("success"));
				form.reset();
			} catch (error) {
				toast.error(t("error"));
			}
		});
	};

	return (
		<section
			id='contact'
			dir={isAr ? "rtl" : "ltr"} // Support Arabic RTL
			className='py-24 bg-muted/20 dark:bg-transparent overflow-hidden'>
			<div className='max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center'>
				{/* Left Side: Content */}
				<motion.div
					initial={{ opacity: 0, x: isAr ? 30 : -30 }} // Flip animation direction
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}>
					<div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6'>
						{t("badge")}
					</div>
					<h2
						className={cn(
							"text-4xl md:text-5xl font-bold mb-6 tracking-tight",
							isAr && "font-sans tracking-normal",
						)}>
						{t("titleStart")}{" "}
						<span className='text-primary'>{t("titleEnd")}</span>
					</h2>
					<div className='text-muted-foreground text-lg leading-relaxed mb-8'>
						{t.rich("description", {
							// 1. Your custom span tag
							innovative: (chunks) => (
								<span className='text-primary font-semibold'>{chunks}</span>
							),
							// 2. The critical fix: handle line breaks
							br: () => <br />,
							// 3. Optional: handle bold or other common tags
							b: (chunks) => <strong>{chunks}</strong>,
						})}
					</div>
					<div
						className={cn(
							"space-y-4 border-primary/20 italic text-sm text-muted-foreground",
							isAr ? "border-r-2 pr-6" : "border-l-2 pl-6",
						)}>
						<p>&quot;{t("quote")}&quot;</p>
					</div>
				</motion.div>

				{/* Right Side: Form Card */}
				<motion.div
					initial={{ opacity: 0, x: isAr ? -30 : 30 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}>
					<Card className='shadow-2xl border-muted-foreground/10 bg-card/80 backdrop-blur-md'>
						<CardContent className='p-8'>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-5'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='name'
											label={t("labelName")}>
											{(field) => (
												<Input
													{...field}
													disabled={isPending}
													placeholder={t("placeholderName")}
													className='bg-background'
												/>
											)}
										</FormFieldWrapper>

										<FormFieldWrapper
											control={form.control}
											name='email'
											label={t("labelEmail")}>
											{(field) => (
												<Input
													{...field}
													disabled={isPending}
													type='email'
													placeholder={t("placeholderEmail")}
													className='bg-background'
												/>
											)}
										</FormFieldWrapper>
									</div>

									<FormFieldWrapper
										control={form.control}
										name='subject'
										label={t("labelSubject")}>
										{(field) => (
											<Input
												{...field}
												value={field.value ?? ""}
												disabled={isPending}
												placeholder={t("placeholderSubject")}
												className='bg-background'
											/>
										)}
									</FormFieldWrapper>

									<FormFieldWrapper
										control={form.control}
										name='message'
										label={t("labelMessage")}>
										{(field) => (
											<Textarea
												{...field}
												disabled={isPending}
												placeholder={t("placeholderMessage")}
												rows={5}
												className='bg-background resize-none'
											/>
										)}
									</FormFieldWrapper>

									<Button
										type='submit'
										disabled={isPending}
										className='w-full h-12 text-lg font-medium transition-all active:scale-[0.98] group'>
										{isPending ? (
											<Loader2 className='mx-2 h-5 w-5 animate-spin' />
										) : (
											<Send
												className={cn(
													"mx-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1",
													isAr && "rotate-180 group-hover:-translate-x-1", // Flip icon for Arabic
												)}
											/>
										)}
										{isPending ? t("btnSending") : t("btnSend")}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
