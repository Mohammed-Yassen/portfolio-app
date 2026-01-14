/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
	contactFormSchema,
	ContactFormValues,
	manageMessageSchema,
} from "../validations/contact";
import { headers } from "next/headers";

import { createSecureAction } from "@/lib/safe-action";

/**
 * PUBLIC: Anyone can send a message.
 * We pass 'null' or omit accessLevel in the wrapper if your utility supports public actions,
 * otherwise, we use it for validation only.
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
/** @format */

import { z } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Valid actions allowed by the UI
 */

export type MessageAction = z.infer<typeof manageMessageSchema>["action"];

/**
 * Manages contact message states with administrative authorization
 */
export async function manageMessage(id: string, action: MessageAction) {
	// We wrap the arguments into an object to match the Zod schema
	return createSecureAction(
		{ id, action },
		{
			schema: manageMessageSchema,
			accessLevel: ["ADMIN", "SUPER_ADMIN", "OWNER"],
		},
		async (data) => {
			const { id, action } = data;

			// 1. Fetch current state to handle toggles
			const message = await prisma.contactMessage.findUnique({
				where: { id },
				select: { id: true, status: true, priority: true },
			});

			if (!message) throw new Error("Message not found");

			// 2. Handle immediate deletion
			if (action === "DELETE") {
				await prisma.contactMessage.delete({ where: { id } });
				revalidatePath("/admin/messages");
				return { success: true };
			}

			// 3. Prepare Update Payload (Type-safe for Prisma)
			const updateData: Prisma.ContactMessageUpdateInput = {};

			switch (action) {
				case "ARCHIVE":
					updateData.status =
						message.status === "ARCHIVED" ? "READ" : "ARCHIVED";
					break;
				case "SPAM":
					updateData.status = message.status === "SPAM" ? "UNREAD" : "SPAM";
					break;
				case "TOGGLE_READ":
					updateData.status = message.status === "UNREAD" ? "READ" : "UNREAD";
					break;
				case "TOGGLE_STAR":
					updateData.priority = !message.priority;
					break;
				case "REPLIED":
					updateData.status = "REPLIED";
					break;
			}

			// 4. Execute Update
			const updated = await prisma.contactMessage.update({
				where: { id },
				data: updateData,
			});

			// 5. Sync Cache
			revalidatePath("/admin/messages");

			return { success: true, data: updated };
		},
	);
}
