/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { contactFormSchema } from "../validations/contact";
import { headers } from "next/headers";
import { ContactMessage } from "@prisma/client";

export type MessageAction =
	| "ARCHIVE"
	| "DELETE"
	| "TOGGLE_STAR"
	| "REPLIED"
	| "TOGGLE_READ"
	| "SPAM";

/**
 * Handle public contact form submissions
 */
export async function sendContactMessage(values: unknown) {
	const validatedFields = contactFormSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields provided." };
	}

	try {
		const headerList = await headers();
		const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";

		await prisma.contactMessage.create({
			data: {
				...validatedFields.data,
				ipAddress: ip,
				status: "UNREAD",
			},
		});

		return { success: true };
	} catch (error) {
		console.error("Contact Action Error:", error);
		return { error: "Failed to send message." };
	}
}

/**
 * Manage existing messages with toggle logic for ARCHIVE and SPAM
 */
export async function manageMessage(id: string, action: MessageAction) {
	try {
		const message = await prisma.contactMessage.findUnique({ where: { id } });
		if (!message) return { success: false, error: "Message not found" };

		// 1. Handle Immediate Deletion
		if (action === "DELETE") {
			await prisma.contactMessage.delete({ where: { id } });
			revalidatePath("/admin/messages");
			return { success: true };
		}

		// 2. Determine Update Data based on Action
		let updateData: Partial<ContactMessage> = {};

		switch (action) {
			case "ARCHIVE":
				// Toggle: If ARCHIVED, move to READ. Otherwise, move to ARCHIVED.
				updateData = {
					status: message.status === "ARCHIVED" ? "READ" : "ARCHIVED",
				};
				break;

			case "SPAM":
				// Toggle: If SPAM, move to UNREAD. Otherwise, move to SPAM.
				updateData = {
					status: message.status === "SPAM" ? "UNREAD" : "SPAM",
				};
				break;

			case "TOGGLE_STAR":
				updateData = { priority: !message.priority };
				break;

			case "TOGGLE_READ":
				updateData = {
					status: message.status === "UNREAD" ? "READ" : "UNREAD",
				};
				break;

			case "REPLIED":
				updateData = { status: "REPLIED" };
				break;

			default:
				return { success: false, error: "Invalid action" };
		}

		const updated = await prisma.contactMessage.update({
			where: { id },
			data: updateData,
		});

		revalidatePath("/admin/messages");
		return { success: true, data: updated };
	} catch (error) {
		console.error("Management Error:", error);
		return { success: false, error: "Database operation failed" };
	}
}
/** @format */

// export async function deleteMessage(id: string) {
// 	try {
// 		await prisma.contactMessage.delete({
// 			where: { id },
// 		});

// 		// Clear the cache for the inbox so the message disappears immediately
// 		revalidatePath("/admin/messages");

// 		return { success: true };
// 	} catch (error) {
// 		console.error("Delete Error:", error);
// 		return { success: false, error: "Failed to delete message." };
// 	}
// }
