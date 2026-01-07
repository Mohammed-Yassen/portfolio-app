/** @format */
"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { loginAction } from "@/server/actions/auth-actions";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PasswordInput, FormError, FormSuccess } from "./auth-components";
import { AuthContainer } from "./auth-container";
import { FormFieldWrapper } from "../input-form-wrapper";
import { LoginFormValues, loginSchema } from "@/server/validations/auth";

export const SignInForm = () => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = React.useState<string | undefined>("");
	const [success, setSuccess] = React.useState<string | undefined>("");
	const searchParams = useSearchParams();

	// Capture where the user came from
	const callbackUrl = searchParams.get("callbackUrl");
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = (values: LoginFormValues) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			loginAction(values, callbackUrl).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<AuthContainer
			headerLabel='Welcome back'
			description='Enter your credentials to access your account'
			backButtonLabel="Don't have an account?"
			backButtonHref='/auth/sign-up'
			showSocial>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormFieldWrapper
							control={form.control}
							name='email'
							label='Email Address'
							disabled={isPending}>
							{(field) => (
								<Input
									{...field}
									placeholder='john.doe@example.com'
									type='email'
									autoComplete='email'
								/>
							)}
						</FormFieldWrapper>

						<FormFieldWrapper
							control={form.control}
							name='password'
							label='Password'
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
							"Sign In"
						)}
					</Button>
				</form>
			</Form>
		</AuthContainer>
	);
};
