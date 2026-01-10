/** @format */
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@prisma/client";
import { FolderOpen, Pencil, Trash2, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransformedProject } from "@/types/project-types";
import { ProjectForm } from "./project-form";
import { ProjectFormValues } from "@/server/validations/project-validation";
import {
	createProjectAction,
	deleteProjectAction,
	updateProjectAction,
} from "@/server/actions/projects-action";

// Import your server actions

interface Props {
	initialData: TransformedProject[];
	locale: Locale;
	availableTags: { id: string; name: string }[];
	availableTechniques: { id: string; name: string }[];
}

export const ProjectFormContainer = ({
	initialData,
	locale,
	availableTags,
	availableTechniques,
}: Props) => {
	const router = useRouter();
	const [selectedProject, setSelectedProject] =
		useState<TransformedProject | null>(null);
	const [isPending, startTransition] = useTransition();

	/**
	 * Handles both Create and Update logic
	 */
	const handleOnSubmit = async (values: ProjectFormValues) => {
		console.log("values Create and Update logic ", values);
		startTransition(async () => {
			const promise = values.id
				? updateProjectAction(values.id, values)
				: createProjectAction(values);

			toast.promise(promise, {
				loading: values.id ? "Updating project..." : "Creating project...",
				success: (res) => {
					if (!res.success) throw new Error(res.error);

					setSelectedProject(null);
					router.refresh();
					return values.id ? "Project updated!" : "Project created!";
				},
				error: (err) => err.message || "Something went wrong",
			});
		});
	};

	/**
	 * Handles Deletion with a confirm check
	 */
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		startTransition(async () => {
			const result = await deleteProjectAction(id);

			if (result.success) {
				toast.success("Project deleted successfully");
				if (selectedProject?.id === id) setSelectedProject(null);
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete");
			}
		});
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto p-6'>
			{/* LEFT SIDE: FORM */}
			<div className='lg:col-span-12'>
				<Card className='rounded-3xl shadow-sm border-muted-foreground/10'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='flex items-center gap-2 text-xl'>
							{selectedProject ? (
								<>
									<Pencil className='w-5 h-5' /> Edit Project
								</>
							) : (
								<>
									<PlusCircle className='w-5 h-5' /> New Project
								</>
							)}
						</CardTitle>
						{isPending && (
							<Loader2 className='w-4 h-4 animate-spin text-primary' />
						)}
					</CardHeader>
					<CardContent>
						<ProjectForm
							locale={locale}
							availableTags={availableTags}
							availableTechniques={availableTechniques}
							selectedProject={selectedProject}
							onSubmit={handleOnSubmit}
						/>

						{selectedProject && (
							<Button
								variant='outline'
								className='mt-4 w-full border-dashed'
								disabled={isPending}
								onClick={() => setSelectedProject(null)}>
								Cancel Editing & Create New
							</Button>
						)}
					</CardContent>
				</Card>
			</div>

			{/* RIGHT SIDE: LIST */}
			<div className='lg:col-span-12 space-y-4'>
				<div className='flex items-center justify-between px-2'>
					<h2 className='font-bold text-lg flex items-center gap-2'>
						<FolderOpen className='w-5 h-5 text-primary' />
						Projects ({initialData.length})
					</h2>
				</div>

				<div className='grid gap-3 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar'>
					{initialData.length === 0 && (
						<div className='text-center py-10 border rounded-2xl border-dashed'>
							<p className='text-muted-foreground text-sm'>
								No projects found.
							</p>
						</div>
					)}

					{initialData.map((project) => (
						<div
							key={project.id}
							className={`group p-4 rounded-2xl border flex justify-between items-center transition-all duration-200 ${
								selectedProject?.id === project.id
									? "ring-2 ring-primary bg-primary/5 border-primary/20"
									: "bg-card hover:border-primary/30 hover:shadow-md"
							}`}>
							<div className='flex flex-col gap-1'>
								<p className='font-semibold leading-none'>{project.title}</p>
								<span className='text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70'>
									{project.category.replace("_", " ")}
								</span>
							</div>

							<div className='flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity'>
								<Button
									size='icon'
									variant='secondary'
									className='h-8 w-8 rounded-lg'
									disabled={isPending}
									onClick={() => setSelectedProject(project)}>
									<Pencil className='w-4 h-4 text-blue-600' />
								</Button>
								<Button
									size='icon'
									variant='secondary'
									className='h-8 w-8 rounded-lg hover:bg-destructive/10'
									disabled={isPending}
									onClick={() => handleDelete(project.id)}>
									<Trash2 className='w-4 h-4 text-destructive' />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
