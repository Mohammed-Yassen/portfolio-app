/** @format */
"use client";

import { useState, useMemo } from "react";
import { Search, ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { TransformedProject } from "@/types/project-types";
import { Locale } from "@prisma/client";
import { ProjectCard } from "@/components/project-card";

interface Props {
	projectsData: TransformedProject[];
	locale: Locale;
}

export function ProjectsListClient({ projectsData, locale }: Props) {
	const [search, setSearch] = useState("");
	const [selectedTab, setSelectedTab] = useState("ALL");

	const isAr = locale === "ar";
	const dir = isAr ? "rtl" : "ltr";

	const content = {
		en: {
			title: "All",
			subtitle: "Projects",
			back: "Back to home",
			search: "Search projects...",
			noFound: "No projects found",
			allCat: "ALL",
		},
		ar: {
			title: "كل",
			subtitle: "المشاريع",
			back: "العودة للرئيسية",
			search: "بحث عن المشاريع...",
			noFound: "لم يتم العثور على مشاريع",
			allCat: "الكل",
		},
	}[locale];

	const categories = useMemo(() => {
		return ["ALL", ...Array.from(new Set(projectsData.map((p) => p.category)))];
	}, [projectsData]);

	const filtered = projectsData.filter((p) => {
		const matchesSearch =
			p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.description.toLowerCase().includes(search.toLowerCase());
		const matchesCat = selectedTab === "ALL" || p.category === selectedTab;
		return matchesSearch && matchesCat;
	});

	return (
		<div dir={dir} className='container mx-auto px-6 py-12 md:py-24'>
			<div
				className={`flex flex-col gap-4 mb-12 ${
					isAr ? "items-end" : "items-start"
				}`}>
				<BackButton
					className='w-fit relative'
					title={content.back}
					icon={isAr ? ArrowRight : ArrowLeft}
					fallback={`/${locale}`}
				/>
				<h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
					{content.title}{" "}
					<span className='text-primary'>{content.subtitle}</span>
				</h1>
			</div>

			<div className='flex flex-col md:flex-row justify-between items-center gap-6 mb-12'>
				<div className='flex flex-wrap gap-2'>
					{categories.map((cat) => (
						<Button
							key={cat}
							variant={selectedTab === cat ? "default" : "outline"}
							onClick={() => setSelectedTab(cat)}
							className='rounded-full text-xs font-semibold'
							size='sm'>
							{cat === "ALL" ? content.allCat : cat.replace("_", " ")}
						</Button>
					))}
				</div>
				<div className='relative w-full md:w-72'>
					<Search
						className={`absolute ${
							isAr ? "right-3" : "left-3"
						} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
					/>
					<Input
						placeholder={content.search}
						className={`${
							isAr ? "pr-10" : "pl-10"
						} rounded-full bg-muted/50 border-none`}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{filtered.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{filtered.map((project) => (
						<ProjectCard
							key={project.id}
							projectsData={project}
							locale={locale}
						/>
					))}
				</div>
			) : (
				<div className='py-24 text-center'>
					<LayoutGrid className='w-12 h-12 mx-auto text-muted-foreground/20 mb-4' />
					<h2 className='text-xl font-medium'>{content.noFound}</h2>
				</div>
			)}
		</div>
	);
}
