/** @format */

// src/lib/admin-guard.ts
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/server/data/users";

import { headers } from "next/headers";

export async function protectAdmin() {
	const headerList = await headers();
	const previousPage = headerList.get("referer") || "/";

	const session = await auth();

	// 1. Check if logged in
	if (!session?.user?.id) {
		redirect("/auth/sign-in");
	}

	// 2. Fetch FRESH role from DB (ignores stale session role)
	const freshRole = await getUserRole(session.user.id);
	const ALLOWED = ["ADMIN", "SUPER_ADMIN", "OWNER"];

	if (!freshRole || !ALLOWED.includes(freshRole)) {
		redirect(previousPage); // Or a 403 Forbidden page
	}

	return session;
}
export async function protectSuperAdmin() {
	const session = await auth();
	const headerList = await headers();

	const previousPage = headerList.get("referer") || "/";
	// 1. Check if logged in
	if (!session?.user?.id) {
		redirect("/auth/sign-in");
	}

	// 2. Fetch FRESH role from DB (ignores stale session role)
	const freshRole = await getUserRole(session.user.id);
	const ALLOWED = ["SUPER_ADMIN"];
	console.log({ freshRole });

	if (!freshRole || !ALLOWED.includes(freshRole)) {
		redirect(previousPage); // Or a 403 Forbidden page
	}

	return session;
}
