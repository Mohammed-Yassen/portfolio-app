/** @format */
import prisma from "@/lib/prisma";
import { Locale, Prisma } from "@prisma/client";
import { TransformedProject } from "@/types/project-types";

// This helper creates a type that matches exactly what our Prisma query returns
type ProjectWithRelations = Prisma.ProjectGetPayload<{
	include: {
		tags: {
			include: { translations: { where: { locale: Locale } } };
		};
		techniques: {
			include: { translations: { where: { locale: Locale } } };
		};
		translations: { where: { locale: Locale } };
	};
}>;

// 1. Reusable Helper with strict typing (No 'any')
const transformProject = (
	project: ProjectWithRelations,
	locale: Locale,
): TransformedProject => {
	const translation = project.translations[0];

	return {
		id: project.id,
		slug: project.slug,
		mainImage: project.mainImage,
		gallery: project.gallery,
		category: project.category,
		liveUrl: project.liveUrl,
		repoUrl: project.repoUrl,
		isFeatured: project.isFeatured,
		isActive: project.isActive,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt,
		locale: locale,
		title: translation?.title || "Untitled Project",
		description: translation?.description || "No description available",
		content: translation?.content || null,
		tags: project.tags.map((tag) => ({
			id: tag.id,
			name: tag.translations[0]?.name || "Unnamed Tag",
		})),
		techniques: project.techniques.map((tech) => ({
			id: tech.id,
			icon: tech.icon || null,
			name: tech.translations[0]?.name || "Unnamed Technique",
		})),
	};
};

// 2. Query Configuration
const projectInclude = (locale: Locale) =>
	({
		tags: {
			include: {
				translations: { where: { locale } },
			},
		},
		techniques: {
			include: {
				translations: { where: { locale } },
			},
		},
		translations: {
			where: { locale },
		},
	} satisfies Prisma.ProjectInclude);

// 3. Get Single Project
export const getProjectById = async (
	id: string,
	locale: Locale,
): Promise<TransformedProject | null> => {
	try {
		const project = await prisma.project.findUnique({
			where: { id },
			include: projectInclude(locale),
		});

		// We cast the result to our relation type for the transformer
		if (!project) return null;

		return transformProject(project as ProjectWithRelations, locale);
	} catch (error) {
		console.error(`[GET_PROJECT_BY_ID_ERROR]:`, error);
		return null;
	}
};

// 4. Get All Projects
export const getProjects = async (
	locale: Locale,
): Promise<TransformedProject[]> => {
	try {
		const projects = await prisma.project.findMany({
			where: { isActive: true },
			include: projectInclude(locale),
			orderBy: { createdAt: "desc" },
		});

		return projects.map((project) =>
			transformProject(project as ProjectWithRelations, locale),
		);
	} catch (error) {
		console.error("GET_PROJECTS_ERROR:", error);
		return [];
	}
};
