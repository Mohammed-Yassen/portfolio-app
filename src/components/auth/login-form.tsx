/** @format */
"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl"; // Added
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { loginAction } from "@/server/actions/auth-actions";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput, FormError, FormSuccess } from "./auth-components";
import { AuthContainer } from "./auth-container";
import { FormFieldWrapper } from "../input-form-wrapper";
import { LoginFormValues, loginSchema } from "@/server/validations/auth";

export const SignInForm = () => {
	const t = useTranslations("Auth"); // Use "Auth" namespace from your JSON files
	const [isPending, startTransition] = useTransition();
	const [error, setError] = React.useState<string | undefined>("");
	const [success, setSuccess] = React.useState<string | undefined>("");
	const searchParams = useSearchParams();

	const callbackUrl = searchParams.get("callbackUrl");

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = (values: LoginFormValues) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			loginAction(values, callbackUrl).then((data) => {
				if (data?.error) setError(t("errors.invalidCredentials"));
				if (data?.success) setSuccess(t("success.loggedIn"));
			});
		});
	};

	return (
		<AuthContainer
			headerLabel={t("welcomeBack")}
			description={t("enterCredentials")}
			backButtonLabel={t("noAccount")}
			backButtonHref='/auth/sign-up'
			showSocial>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
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
									autoComplete='current-password'
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
							t("submitButton")
						)}
					</Button>
				</form>
			</Form>
		</AuthContainer>
	);
};
