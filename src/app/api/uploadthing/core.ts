/** @format */

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Simulated Auth - In a real app, get this from Kinde, Clerk, or NextAuth
const auth = (req: Request) => ({ id: "user_admin_01" });

export const ourFileRouter = {
	// --- RESUME ROUTE (Supports PDF & Word) ---
	resumeUploader: f({
		pdf: { maxFileSize: "4MB", maxFileCount: 1 },
		"application/msword": { maxFileSize: "4MB", maxFileCount: 1 },
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log(`Resume upload complete for user: ${metadata.userId}`);
			console.log("File URL:", file.url);
		}),

	// --- PRIMARY IMAGE ROUTE ---
	primaryImage: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Avatar upload complete. Key:", file.key);
		}),

	// --- SECONDARY GALLERY ROUTE ---
	secondaryImages: f({
		image: { maxFileSize: "4MB", maxFileCount: 5 },
	}).onUploadComplete(async ({ file }) => {
		console.log("Gallery asset uploaded:", file.url);
	}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
