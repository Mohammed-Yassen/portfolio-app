/** @format */
"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	User,
	Code,
	Mail,
	Sun,
	Moon,
	Terminal,
	Settings,
	MoreHorizontal,
	MessageSquare,
	Award,
	BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMounted } from "@/app/hooks/is-mounted";
import { Locale } from "@prisma/client";

const navTranslations = {
	en: {
		home: "Home",
		about: "About",
		skills: "Skills",
		projects: "Projects",
		contact: "Contact",
		services: "Services",
		testimonials: "Testimonials",
		certifications: "Certifications",
		blog: "Blog",
		more: "More",
	},
	ar: {
		home: "الرئيسية",
		about: "من أنا",
		skills: "المهارات",
		projects: "المشاريع",
		contact: "تواصل معي",
		services: "الخدمات",
		testimonials: "التوصيات",
		certifications: "الشهادات",
		blog: "المدونة",
		more: "المزيد",
	},
};

interface FloatingDockProps {
	locale: Locale;
	config?: {
		navActive: boolean;
		heroActive: boolean;
		aboutActive: boolean;
		skillActive: boolean;
		experienceActive: boolean;
		projectActive: boolean;
		blogActive: boolean;
		contactActive: boolean;
		testimonialActive: boolean;
		footerActive: boolean;
		serviceActive: boolean;
		certificationActive: boolean;
		resumeActive: boolean;
	};
}

export const FloatingDock = ({ locale, config }: FloatingDockProps) => {
	const mounted = useIsMounted();
	const [showMore, setShowMore] = useState(false);
	const { theme, setTheme } = useTheme();

	const t =
		navTranslations[locale as keyof typeof navTranslations] ||
		navTranslations.en;

	// Filter Primary Items based on config visibility
	const primaryItems = useMemo(() => {
		const items = [
			{
				key: "heroActive",
				name: t.home,
				href: "#hero",
				icon: <Home className='w-5 h-5' />,
			},
			{
				key: "aboutActive",
				name: t.about,
				href: "#about",
				icon: <User className='w-5 h-5' />,
			},
			{
				key: "skillActive",
				name: t.skills,
				href: "#skills",
				icon: <Terminal className='w-5 h-5' />,
			},
			{
				key: "projectActive",
				name: t.projects,
				href: "#projects",
				icon: <Code className='w-5 h-5' />,
			},
			{
				key: "contactActive",
				name: t.contact,
				href: "#contact",
				icon: <Mail className='w-5 h-5' />,
			},
		];
		return items.filter(
			(item) => config?.[item.key as keyof typeof config] !== false,
		);
	}, [t, config]);

	// Filter Secondary Items based on config visibility
	const secondaryItems = useMemo(() => {
		const items = [
			{
				key: "serviceActive",
				name: t.services,
				href: "#services",
				icon: <Settings className='w-4 h-4' />,
			},
			{
				key: "testimonialActive",
				name: t.testimonials,
				href: "#testimonials",
				icon: <MessageSquare className='w-4 h-4' />,
			},
			{
				key: "certificationActive",
				name: t.certifications,
				href: "#certifications",
				icon: <Award className='w-4 h-4' />,
			},
			{
				key: "blogActive",
				name: t.blog,
				href: "#blog",
				icon: <BookOpen className='w-4 h-4' />,
			},
		];
		return items.filter(
			(item) => config?.[item.key as keyof typeof config] !== false,
		);
	}, [t, config]);

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		e.preventDefault();
		const targetId = href.replace("#", "");
		const elem = document.getElementById(targetId);
		elem?.scrollIntoView({ behavior: "smooth" });
		setShowMore(false);
	};

	if (!mounted) return null;

	return (
		<div className='fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none'>
			<div className='relative flex flex-col items-center'>
				{/* Vertical Sub-menu (AnimatePresence) */}
				<AnimatePresence>
					{showMore && secondaryItems.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: -10, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							className='absolute bottom-full mb-2 flex flex-col gap-2 p-2 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl pointer-events-auto min-w-[150px]'>
							{secondaryItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									onClick={(e) => handleScroll(e, item.href)}
									className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all group'>
									{item.icon}
									<span className='font-medium'>{item.name}</span>
								</a>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Horizontal Main Dock */}
				<nav className='flex items-center gap-1 p-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-border shadow-2xl pointer-events-auto'>
					<TooltipProvider delayDuration={0}>
						{primaryItems.map((item) => (
							<Tooltip key={item.name}>
								<TooltipTrigger asChild>
									<a
										href={item.href}
										onClick={(e) => handleScroll(e, item.href)}
										className='p-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1.5 active:scale-95'>
										{item.icon}
									</a>
								</TooltipTrigger>
								<TooltipContent
									side='top'
									className='bg-primary text-primary-foreground font-bold mb-2'>
									{item.name}
								</TooltipContent>
							</Tooltip>
						))}

						{/* More Button: Only show if secondary items exist */}
						{secondaryItems.length > 0 && (
							<>
								<div className='w-px h-6 bg-border mx-1' />
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => setShowMore(!showMore)}
											className={`p-3 rounded-xl transition-all duration-300 ${
												showMore
													? "bg-primary text-primary-foreground rotate-90"
													: "text-muted-foreground hover:bg-primary/10"
											}`}>
											<MoreHorizontal className='w-5 h-5' />
										</button>
									</TooltipTrigger>
									<TooltipContent
										side='top'
										className='bg-primary text-primary-foreground font-bold mb-2'>
										{t.more}
									</TooltipContent>
								</Tooltip>
							</>
						)}

						<div className='w-px h-6 bg-border mx-1' />

						{/* Theme Toggle */}
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className='rounded-xl hover:bg-primary/10 transition-transform active:rotate-45'>
							{theme === "dark" ? (
								<Sun className='w-5 h-5' />
							) : (
								<Moon className='w-5 h-5' />
							)}
						</Button>
					</TooltipProvider>
				</nav>
			</div>
		</div>
	);
};
