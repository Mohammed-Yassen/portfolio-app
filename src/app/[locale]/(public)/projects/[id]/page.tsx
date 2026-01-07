/** @format */

import { notFound } from "next/navigation";
import { SingleProjectClient } from "./single-project-client";
import { Locale } from "@prisma/client";
import { getProjectById } from "@/server/data/projects";

interface Props {
	params: Promise<{
		id: string;
		locale: string; // locale is usually part of the dynamic route [locale]
	}>;
}

export default async function ProjectPage({ params }: Props) {
	// 1. Unwrap the params promise (Required in Next.js 15)
	const { id, locale } = await params;

	// 2. Fetch data using the unwrapped id and typed locale
	// We cast locale to Locale type from Prisma
	const project = await getProjectById(id, locale as Locale);

	// 3. Handle 404
	if (!project) {
		notFound();
	}

	// 4. Return the client component with the transformed data
	return <SingleProjectClient project={project} locale={locale as Locale} />;
}
