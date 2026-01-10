/** @format */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ContactQuery, contactQuerySchema } from "../validations/contact";
import { ContactMessage } from "@prisma/client";

export type MessageAction =
	| "ARCHIVE"
	| "DELETE"
	| "TOGGLE_STAR"
	| "REPLIED"
	| "TOGGLE_READ"
	| "SPAM";

export async function getContactMessages(
	query: ContactQuery = { limit: 10, page: 1 },
) {
	try {
		const validatedQuery = contactQuerySchema.parse(query);
		const { page, limit, status, priority } = validatedQuery;
		const skip = (page - 1) * limit;

		const where = {
			...(status && { status }),
			...(priority !== undefined && { priority }),
		};

		const [messages, totalCount] = await Promise.all([
			prisma.contactMessage.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.contactMessage.count({ where }),
		]);

		return {
			data: messages as ContactMessage[], // Casting to avoid strict Date vs String mismatches in generic wrappers
			meta: {
				totalCount,
				pageCount: Math.ceil(totalCount / limit),
				currentPage: page,
			},
		};
	} catch (error) {
		return { error: "Could not retrieve messages." };
	}
}

export async function manageMessage(id: string, action: MessageAction) {
	try {
		const current = await prisma.contactMessage.findUnique({ where: { id } });
		if (!current) return { error: "Message not found" };

		switch (action) {
			case "DELETE":
				await prisma.contactMessage.delete({ where: { id } });
				break;
			case "ARCHIVE":
				await prisma.contactMessage.update({
					where: { id },
					data: { status: "ARCHIVED" },
				});
				break;
			case "SPAM":
				await prisma.contactMessage.update({
					where: { id },
					data: { status: "SPAM" },
				});
				break;
			case "TOGGLE_STAR":
				await prisma.contactMessage.update({
					where: { id },
					data: { priority: !current.priority },
				});
				break;
			case "REPLIED":
				await prisma.contactMessage.update({
					where: { id },
					data: { status: "REPLIED" },
				});
				break;
			case "TOGGLE_READ":
				await prisma.contactMessage.update({
					where: { id },
					data: { status: current.status === "UNREAD" ? "READ" : "UNREAD" },
				});
				break;
		}

		revalidatePath("/admin/messages");
		return { success: true };
	} catch (error) {
		return { error: "Action failed" };
	}
}
