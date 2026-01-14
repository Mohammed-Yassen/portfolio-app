/** @format */
"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { registerAction } from "@/server/actions/auth-actions";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	PasswordInput,
	FormError,
	FormSuccess,
	FormCheckboxWrapper,
} from "./auth-components";
import { AuthContainer } from "./auth-container";
import { FormFieldWrapper } from "../input-form-wrapper";
import { RegisterFormValues, registerSchema } from "@/server/validations/auth";

export const SignUpForm = () => {
	const t = useTranslations("Auth");
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			acceptedTerms: false as unknown as true,
		},
	});

	const onSubmit = (values: RegisterFormValues) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			registerAction(values).then((data) => {
				if (data?.error) setError(t("errors.registrationFailed"));
				if (data?.success) {
					setSuccess(t("success.accountCreated"));
					form.reset();
				}
			});
		});
	};

	return (
		<AuthContainer
			headerLabel={t("createAccount")}
			description={t("getStartedDetails")}
			backButtonLabel={t("alreadyHaveAccount")}
			backButtonHref='/auth/sign-in'
			showSocial>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormFieldWrapper
							control={form.control}
							name='name'
							label={t("fullNameLabel")}
							disabled={isPending}>
							{(field) => (
								<Input {...field} placeholder='John Doe' autoComplete='name' />
							)}
						</FormFieldWrapper>

						<FormFieldWrapper
							control={form.control}
							name='email'
							label={t("emailLabel")}
							disabled={isPending}>
							{(field) => (
								<Input
									{...field}
									placeholder='email@example.com'
									type='email'
									autoComplete='email'
								/>
							)}
						</FormFieldWrapper>

						<FormFieldWrapper
							control={form.control}
							name='password'
							label={t("passwordLabel")}
							disabled={isPending}>
							{(field) => (
								<PasswordInput
									{...field}
									placeholder='••••••••'
									autoComplete='new-password'
								/>
							)}
						</FormFieldWrapper>

						<FormFieldWrapper control={form.control} name='acceptedTerms'>
							{(field) => (
								<FormCheckboxWrapper
									id='terms'
									value={field.value}
									onChange={field.onChange}
									label={
										<span className='text-sm'>
											{t("acceptTerms")}{" "}
											<Link
												href='/terms'
												className='text-primary hover:underline font-medium'>
												{t("termsLink")}
											</Link>
										</span>
									}
								/>
							)}
						</FormFieldWrapper>
					</div>

					<FormError message={error} />
					<FormSuccess message={success} />

					<Button type='submit' className='w-full' disabled={isPending}>
						{isPending ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							t("signUpSubmit")
						)}
					</Button>
				</form>
			</Form>
		</AuthContainer>
	);
};
