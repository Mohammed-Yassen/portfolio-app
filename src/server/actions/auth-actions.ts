/** @format */
"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";
import {
	LoginFormValues,
	loginSchema,
	RegisterFormValues,
	registerSchema,
} from "../validations/auth";
import prisma from "@/lib/prisma";

// Helper for consistent error messages (Security Best Practice)
const GENERIC_ERROR = "Invalid credentials!";

/**
 * LOGIN ACTION
 */
export async function loginAction(
	values: LoginFormValues,
	callbackUrl?: string | null,
) {
	// 1. Structural Validation
	const validatedFields = loginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid input fields." };
	}

	const { email, password } = validatedFields.data;
	const normalizedEmail = email.toLowerCase().trim();

	try {
		// 2. Pre-Authentication Data Checks
		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
			select: { emailVerified: true, password: true, role: true },
		});

		// Security: Don't reveal if user doesn't exist; use same message for no user vs wrong pass
		if (!existingUser || !existingUser.password) {
			return { error: GENERIC_ERROR };
		}

		// 3. Status Checks
		if (!existingUser.emailVerified) {
			// Logic for re-sending verification can go here
			return { error: "Please verify your email address before logging in." };
		}

		// 4. Determine Redirect Path (Fixing ternary precedence)
		// Order: callbackUrl > Admin Route > Default Route
		let redirectPath = "/";
		if (callbackUrl) {
			redirectPath = callbackUrl;
		} else {
			redirectPath = existingUser.role === "ADMIN" ? "/dashboard" : "/";
		}

		// 5. Execution
		await signIn("credentials", {
			email: normalizedEmail,
			password,
			redirectTo: redirectPath,
		});

		return { success: "Logged in successfully!" };
	} catch (error) {
		// IMPORTANT: Handle Redirects first
		if (isRedirectError(error)) throw error;

		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: GENERIC_ERROR };
				case "AccessDenied":
					return { error: "Account access restricted." };
				default:
					return { error: "An authentication error occurred." };
			}
		}

		console.error("CRITICAL_LOGIN_ERROR:", error);
		return { error: "Internal server error. Please try again later." };
	}
}

/**
 * REGISTER ACTION
 */
export async function registerAction(values: RegisterFormValues) {
	const validatedFields = registerSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid input fields." };
	}

	const { email, password, name, acceptedTerms } = validatedFields.data;
	const normalizedEmail = email.toLowerCase().trim();

	try {
		// Use a Transaction if you add more steps (like creating a default profile)
		return await prisma.$transaction(async (tx) => {
			const existingUser = await tx.user.findUnique({
				where: { email: normalizedEmail },
			});

			if (existingUser) {
				return { error: "Email already in use!" };
			}

			const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for 2025 security

			await tx.user.create({
				data: {
					name,
					email: normalizedEmail,
					password: hashedPassword,
					// Track when they accepted policy (from our previous step)
					// policyAcceptedAt: new Date(),
				},
			});
		});
		return { success: "Account created! Please check your email to verify." };
	} catch (error) {
		console.error("CRITICAL_REGISTRATION_ERROR:", error);
		return { error: "Could not create account. Please try again." };
	}
}
/** @format */
// actions/auth-utils.ts
