/** @format */
import { getProjects } from "@/server/data/projects";
import { Locale } from "@prisma/client";
import { ProjectForm } from "./project-form";
import prisma from "@/lib/prisma";
import { ProjectFormContainer } from "./projects-control";

interface Props {
	params: Promise<{ locale: Locale }>;
}

export default async function ProjectsControlPage({ params }: Props) {
	const { locale } = await params;

	// Fetch data in parallel for better performance
	const [projects, tags, techniques] = await Promise.all([
		getProjects(locale),
		prisma.tag.findMany({
			select: {
				id: true,
				translations: { where: { locale }, select: { name: true, id: true } },
			},
		}),
		prisma.technique.findMany({
			select: {
				id: true,
				translations: { where: { locale }, select: { name: true } },
			},
		}),
	]);

	// Flatten translations for the multi-select components
	const availableTags = tags.map((t) => ({
		id: t.id,
		name: t.translations[0]?.name || "Unnamed Tech",
	}));
	const availableTechniques = techniques.map((t) => ({
		id: t.id,
		name: t.translations[0]?.name || "Unnamed Tech",
	}));

	return (
		<div className='p-4 md:px-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen'>
			<header className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-zinc-900 dark:text-white uppercase'>
						Projects Dashboard
					</h1>
					<p className='text-zinc-500'>
						Managing {locale.toUpperCase()} Content
					</p>
				</div>
				<div className='px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold'>
					{locale.toUpperCase()}
				</div>
			</header>

			<ProjectFormContainer
				initialData={projects}
				locale={locale}
				availableTags={availableTags}
				availableTechniques={availableTechniques}
			/>
		</div>
	);
}
