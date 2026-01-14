/** @format */
import { auth } from "@/auth";
import { UserRole, UserStatus } from "@prisma/client";
import { z, ZodSchema } from "zod";
import prisma from "./prisma";

// Senior Tip: Use a Discriminated Union for the session
// This forces the developer to check 'isPublic' before accessing user data
type SessionContext =
	| { isPublic: true; user: null }
	| { isPublic: false; user: SessionUser };

export type SessionUser = {
	id: string;
	email: string;
	role: UserRole;
	name?: string | null;
	image?: string | null;
};

type ActionResponse<R> =
	| { success: true; data: R }
	| {
			success: false;
			error: string;
			status: 400 | 401 | 403 | 500;
			details?: unknown;
	  };

interface SecureActionOptions<T extends ZodSchema> {
	schema: T;
	accessLevel: "PUBLIC" | "AUTHENTICATED" | UserRole[];
	systemKey?: string; // Optional sudo-level check
}

/**
 * Advanced Secure Action: Unified for Public, Users, Admins, and Super Admins
 */
export async function createSecureAction<T extends ZodSchema, R>(
	input: unknown,
	options: SecureActionOptions<T>,
	callback: (data: z.infer<T>, ctx: SessionContext) => Promise<R>,
): Promise<ActionResponse<R>> {
	try {
		const validation = options.schema.safeParse(input);
		if (!validation.success) {
			return {
				success: false,
				error: "VALIDATION_ERROR",
				status: 400,
				details: validation.error.flatten(),
			};
		}

		const session = await auth();
		const userId = session?.user?.id;
		let context: SessionContext = { isPublic: true, user: null };

		if (options.accessLevel !== "PUBLIC") {
			if (!userId)
				return { success: false, error: "UNAUTHORIZED", status: 401 };

			// Real-time DB Sync for Role AND Status
			const dbUser = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					role: true,
					name: true,
					image: true,
					status: true,
				},
			});

			if (!dbUser || !dbUser.email)
				return { success: false, error: "USER_NOT_FOUND", status: 401 };

			// BLOCK BANNED/DELETED USERS
			if (dbUser.status !== UserStatus.ACTIVE) {
				return { success: false, error: `USER_${dbUser.status}`, status: 403 };
			}

			// Role Check
			if (
				Array.isArray(options.accessLevel) &&
				!options.accessLevel.includes(dbUser.role)
			) {
				return { success: false, error: "FORBIDDEN", status: 403 };
			}

			context = { isPublic: false, user: { ...dbUser, email: dbUser.email } };
		}

		// Execution
		const result = await callback(validation.data, context);

		// SENIOR TOUCH: Automatic Audit Logging for non-public actions
		if (!context.isPublic) {
			await prisma.auditLog
				.create({
					data: {
						action: `ACTION_EXECUTED`,
						userId: context.user.id,
						userEmail: context.user.email,
						details: JSON.stringify({ input: validation.data }),
						isSudo: !!options.systemKey,
					},
				})
				.catch((e) => console.error("Audit log failed", e));
		}

		return { success: true, data: result };
	} catch (error) {
		console.error("Action Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Internal Error",
			status: 500,
		};
	}
}
// export async function createSecureAction<T extends ZodSchema, R>(
// 	input: unknown,
// 	options: SecureActionOptions<T>,
// 	callback: (data: z.infer<T>, ctx: SessionContext) => Promise<R>,
// ): Promise<ActionResponse<R>> {
// 	try {
// 		// 1. Input Validation (Fail early)
// 		const validation = options.schema.safeParse(input);
// 		if (!validation.success) {
// 			return {
// 				success: false,
// 				error: "VALIDATION_ERROR",
// 				status: 400,
// 				details: validation.error.flatten(),
// 			};
// 		}

// 		// 2. Auth Retrieval
// 		const session = await auth();
// 		const userId = session?.user?.id;

// 		// 3. Access Level Logic
// 		let context: SessionContext = { isPublic: true, user: null };

// 		if (options.accessLevel !== "PUBLIC") {
// 			// Must be logged in
// 			if (!userId)
// 				return { success: false, error: "UNAUTHORIZED", status: 401 };

// 			// DB Sync: Ensure role hasn't changed in real-time
// 			const dbUser = await prisma.user.findUnique({
// 				where: { id: userId },
// 				select: { id: true, email: true, role: true, name: true, image: true },
// 			});

// 			if (!dbUser || !dbUser.email)
// 				return { success: false, error: "USER_NOT_FOUND", status: 401 };

// 			// Role Check (if accessLevel is an array of roles like ['ADMIN'])
// 			if (
// 				Array.isArray(options.accessLevel) &&
// 				!options.accessLevel.includes(dbUser.role)
// 			) {
// 				return {
// 					success: false,
// 					error: "FORBIDDEN_INSUFFICIENT_ROLE",
// 					status: 403,
// 				};
// 			}

// 			context = {
// 				isPublic: false,
// 				user: { ...dbUser, email: dbUser.email },
// 			};
// 		}

// 		// 4. System Key (Sudo Mode) - High security for Super Admins
// 		if (options.systemKey !== undefined) {
// 			if (options.systemKey !== process.env.SUPER_ADMIN_SYSTEM_KEY) {
// 				return { success: false, error: "INVALID_SYSTEM_KEY", status: 403 };
// 			}
// 		}

// 		// 5. Execution
// 		const result = await callback(validation.data, context);
// 		return { success: true, data: result };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Internal Server Error";
// 		console.error("Secure Action Error:", message);
// 		return { error: message, status: 500, success: false };
// 	}
// }
