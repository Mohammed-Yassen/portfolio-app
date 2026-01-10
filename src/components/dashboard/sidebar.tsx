/** @format */
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
	Briefcase,
	Mail,
	Settings,
	Sun,
	Moon,
	Command,
	Menu,
	ArrowUpRight,
	DockIcon,
	MessageSquareQuote,
	Layout,
	Users,
	LogOut,
	LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMounted } from "@/app/hooks/is-mounted";

// Import dictionaries for type safety
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { LanguageToggle } from "../shared/language-toggle";

// --- Strict Types ---
type SidebarTranslations = typeof en.sidebar;

interface NavItem {
	name: string;
	href: string;
	icon: LucideIcon;
}

interface SidebarContentProps {
	t: SidebarTranslations;
	locale: string;
	pathname: string;
	isRtl: boolean;
	theme?: string;
	setTheme: (v: string) => void;
	menuItems: NavItem[];
}

// --- Sub-Component: SidebarContent ---
const SidebarContent = ({
	t,
	locale,
	pathname,
	isRtl,
	theme,
	setTheme,
	menuItems,
}: SidebarContentProps) => (
	<div className='flex flex-col h-full bg-white dark:bg-zinc-950 border-inline-end border-zinc-200/60 dark:border-zinc-800/60'>
		{/* Brand Header */}
		<div className='p-6'>
			<div
				className={cn(
					"flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50",
					// isRtl && "flex-row-reverse",
				)}>
				<div className='h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20'>
					<Command size={20} />
				</div>
				<div
					className={cn("overflow-hidden", isRtl ? "text-right" : "text-left")}>
					<p className='font-bold text-sm truncate uppercase tracking-tight text-zinc-900 dark:text-zinc-100'>
						{t.admin}
					</p>
					<p className='text-[10px] text-zinc-400 font-medium'>{t.version}</p>
				</div>
			</div>
		</div>

		{/* Nav Links */}
		<ScrollArea className='flex-1 px-4'>
			<nav className='space-y-1.5' dir={isRtl ? "rtl" : "ltr"}>
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className='block outline-none'>
							<div
								className={cn(
									"flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
									isActive
										? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
										: "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200",
								)}>
								<item.icon
									size={18}
									strokeWidth={isActive ? 2.5 : 2}
									className='shrink-0'
								/>
								<span className='font-semibold text-[14px] leading-none'>
									{item.name}
								</span>
								{isActive && (
									<motion.div
										layoutId='active'
										className={cn("ms-auto", isRtl && "rotate-180")}>
										<ArrowUpRight size={14} className='opacity-60' />
									</motion.div>
								)}
							</div>
						</Link>
					);
				})}
			</nav>
		</ScrollArea>

		{/* Footer Area */}
		<div className='p-4 mt-auto'>
			<div className='space-y-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50'>
				{/* Use your LanguageToggle component here */}
				<div className='flex items-center justify-between px-1'>
					<span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>
						{isRtl ? "اللغة" : "Language"}
					</span>
					<LanguageToggle />
				</div>

				{/* Theme Toggle */}
				<div
					className='flex items-center justify-between px-1'
					dir={isRtl ? "rtl" : "ltr"}>
					<span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>
						{t.mode}
					</span>
					<button
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className='h-6 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-full relative p-1 transition-colors'>
						<motion.div
							animate={{ x: theme === "dark" ? 16 : 0 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='h-4 w-4 bg-white dark:bg-blue-500 rounded-full shadow-sm flex items-center justify-center'>
							{theme === "dark" ? (
								<Moon size={8} className='text-white' />
							) : (
								<Sun size={8} className='text-zinc-500' />
							)}
						</motion.div>
					</button>
				</div>

				<div className='h-px bg-zinc-200 dark:bg-zinc-800 mx-1' />

				{/* Logout */}
				<Button
					variant='ghost'
					className={cn(
						"w-full justify-start gap-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 font-bold h-10 px-2",
						isRtl && "flex-row-reverse",
					)}>
					<LogOut size={18} />
					<span>{t.logout}</span>
				</Button>
			</div>
		</div>
	</div>
);

// --- Main Sidebar Wrapper ---
export function Sidebar({ locale = "en" }: { locale: string }) {
	const mounted = useIsMounted();
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	const t: SidebarTranslations = useMemo(
		() => (locale === "ar" ? ar.sidebar : en.sidebar),
		[locale],
	);
	const isRtl = locale === "ar";

	const menuItems: NavItem[] = useMemo(
		() => [
			{ name: t.menu.overview, href: `/${locale}/admin`, icon: Layout },
			{
				name: t.menu.projects,
				href: `/${locale}/admin/projects`,
				icon: Briefcase,
			},
			{ name: t.menu.blogs, href: `/${locale}/admin/blogs`, icon: DockIcon },
			{
				name: t.menu.testimonials,
				href: `/${locale}/admin/testimonials`,
				icon: MessageSquareQuote,
			},
			{ name: t.menu.messages, href: `/${locale}/admin/messages`, icon: Mail },
			{ name: t.menu.users, href: `/${locale}/admin/users`, icon: Users },
			{
				name: t.menu.settings,
				href: `/${locale}/admin/setting`,
				icon: Settings,
			},
		],
		[t, locale],
	);

	if (!mounted) return null;

	const props: SidebarContentProps = {
		t,
		locale,
		pathname,
		isRtl,
		theme,
		setTheme,
		menuItems,
	};

	return (
		<>
			{/* Mobile Navigation */}
			<div
				className='lg:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800'
				dir={isRtl ? "rtl" : "ltr"}>
				<div className='h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white'>
					<Command size={16} />
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='ghost' size='icon' className='rounded-xl'>
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent
						side={isRtl ? "right" : "left"}
						className='p-0 w-72 border-none'>
						<SidebarContent {...props} />
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 z-50 hidden lg:flex flex-col w-72 bg-white dark:bg-zinc-950 shadow-sm transition-all duration-300 border-zinc-200 dark:border-zinc-800",
					isRtl ? "right-0 border-l" : "left-0 border-r",
				)}>
				<SidebarContent {...props} />
			</aside>
		</>
	);
}

// Dummy Component Placeholder - Replace with your actual LanguageToggle import
