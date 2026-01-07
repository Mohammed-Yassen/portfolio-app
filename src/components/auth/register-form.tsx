/** @format */
"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/server/actions/auth-actions";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
	PasswordInput,
	FormError,
	FormSuccess,
	FormCheckboxWrapper,
} from "./auth-components";
import { AuthContainer } from "./auth-container";
import { FormFieldWrapper } from "../input-form-wrapper";
import Link from "next/link";
import { RegisterFormValues, registerSchema } from "@/server/validations/auth";

export const SignUpForm = () => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			// This tells TS: "I know it starts as false, but treat it as the literal type"
			acceptedTerms: false as unknown as true,
		},
	});

	const onSubmit = (values: RegisterFormValues) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			registerAction(values).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
				if (data?.success) form.reset(); // Clear form on success
			});
		});
	};

	return (
		<AuthContainer
			headerLabel='Create an account'
			description='Enter your details to get started'
			backButtonLabel='Already have an account?'
			backButtonHref='/auth/sign-in'
			showSocial>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormFieldWrapper
							control={form.control}
							name='name'
							label='Full Name'
							disabled={isPending}>
							{(field) => (
								<Input {...field} placeholder='John Doe' autoComplete='name' />
							)}
						</FormFieldWrapper>

						<FormFieldWrapper
							control={form.control}
							name='email'
							label='Email Address'
							disabled={isPending}>
							{(field) => (
								<Input
									{...field}
									placeholder='john@example.com'
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
										<span>
											I accept the{" "}
											<Link href='/terms' className='text-primary underline'>
												Terms
											</Link>{" "}
											and{" "}
											<Link href='/privacy' className='text-primary underline'>
												Privacy Policy
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
							"Create account"
						)}
					</Button>
				</form>
			</Form>
		</AuthContainer>
	);
};
