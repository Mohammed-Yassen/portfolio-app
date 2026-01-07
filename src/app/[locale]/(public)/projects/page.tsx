/** @format */

import { ProjectsListClient } from "./projects-client";
import { Suspense } from "react";
import { ProjectsSkeleton } from "@/components/sections/sections-skeleton";
import { getProjects } from "@/server/data/projects";
import { Locale } from "@prisma/client";

interface Props {
	params: Promise<{ locale: Locale }>;
}

export default async function ProjectsPage({ params }: Props) {
	const { locale } = await params;
	const data = await getProjects(locale);

	return (
		<div className='min-h-screen bg-background'>
			<Suspense fallback={<ProjectsSkeleton />}>
				<ProjectsListClient locale={locale} projectsData={data} />
			</Suspense>
		</div>
	);
}
