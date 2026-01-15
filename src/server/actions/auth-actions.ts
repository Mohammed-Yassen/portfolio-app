/** @format */
"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
	LoginFormValues,
	loginSchema,
	RegisterFormValues,
	registerSchema,
} from "../validations/auth";

const GENERIC_ERROR = "Invalid credentials!";

/**
 * LOGIN ACTION
 */
export async function loginAction(
	values: LoginFormValues,
	callbackUrl?: string | null,
) {
	const validatedFields = loginSchema.safeParse(values);
	if (!validatedFields.success) return { error: "Invalid input fields." };

	const { email, password } = validatedFields.data;
	const normalizedEmail = email.toLowerCase().trim();

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
			select: {
				id: true,
				password: true,
				role: true,
				status: true,
				emailVerified: true,
			},
		});

		// 1. Security & Existence Check
		if (!existingUser || !existingUser.password)
			return { error: GENERIC_ERROR };

		// 2. Account Status Check (BANNED/DELETED/PENDING)
		if (existingUser.status === "BANNED")
			return { error: "This account has been suspended." };
		if (existingUser.status === "DELETED") return { error: GENERIC_ERROR };
		if (
			existingUser.status === "PENDING_VERIFICATION" ||
			!existingUser.emailVerified
		) {
			return { error: "Please verify your email before logging in." };
		}

		// 3. Determine Redirect Path
		// Priority: callbackUrl > Admin/Owner Dash > Home
		const isAdmin = ["ADMIN", "SUPER_ADMIN", "OWNER"].includes(
			existingUser.role,
		);
		const redirectPath = callbackUrl || (isAdmin ? "/admin" : "/");

		await signIn("credentials", {
			email: normalizedEmail,
			password,
			redirectTo: redirectPath,
		});

		return { success: "Success!" };
	} catch (error) {
		if (isRedirectError(error)) throw error;

		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: GENERIC_ERROR };
				default:
					return { error: "Something went wrong." };
			}
		}
		return { error: "Internal server error." };
	}
}

/**
 * REGISTER ACTION
 */
export async function registerAction(values: RegisterFormValues) {
	const validatedFields = registerSchema.safeParse(values);
	if (!validatedFields.success) return { error: "Invalid input fields." };

	const { email, password, name } = validatedFields.data;
	const normalizedEmail = email.toLowerCase().trim();

	try {
		const result = await prisma.$transaction(async (tx) => {
			const existingUser = await tx.user.findUnique({
				where: { email: normalizedEmail },
			});

			if (existingUser) return { error: "Email already in use!" };

			const hashedPassword = await bcrypt.hash(password, 12);

			const newUser = await tx.user.create({
				data: {
					name,
					email: normalizedEmail,
					password: hashedPassword,
					status: "ACTIVE", // Or PENDING_VERIFICATION if using emails
					// role defaults to USER in schema
				},
			});

			// Optional: Create an empty profile automatically
			await tx.profile.create({
				data: { userId: newUser.id },
			});

			return { success: true };
		});

		if (result.error) return { error: result.error };

		return { success: "Account created! You can now sign in." };
	} catch (error) {
		console.error("REGISTRATION_ERROR:", error);
		return { error: "Could not create account." };
	}
}
