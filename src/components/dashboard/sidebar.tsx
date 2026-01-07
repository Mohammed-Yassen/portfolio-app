/** @format */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
	LayoutDashboard,
	User,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from "@/components/ui/sheet";
import { useIsMounted } from "@/app/hooks/is-mounted";

// --- المكونات خارج الـ Render ---

const menuItems = [
	{ name: "Overview", href: "/admin", icon: Layout },
	{ name: "Settings", href: "/admin/setting", icon: Settings },
	{ name: "Projects", href: "/admin/projects", icon: Briefcase },
	{ name: "Blogs", href: "/admin/blogs", icon: DockIcon },
	{
		name: "Testimonials",
		href: "/admin/testimonials",
		icon: MessageSquareQuote,
	},
	{ name: "Messages", href: "/admin/messages", icon: Mail },
	{ name: "Users", href: "/admin/users", icon: Users },
];

// 1. مكون الروابط
const NavLinks = ({
	isMobile,
	pathname,
}: {
	isMobile?: boolean;
	pathname: string;
}) => (
	<div className={cn("space-y-1.5", isMobile ? "mt-10" : "px-4 flex-1")}>
		{menuItems.map((item) => {
			const isActive = pathname === item.href;
			return (
				<Link key={item.name} href={item.href} className='relative block group'>
					<div
						className={cn(
							"flex items-center justify-between gap-4 p-3.5 rounded-2xl transition-all duration-300",
							isActive
								? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
								: "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200",
						)}>
						<div className='flex items-center gap-3'>
							<item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
							<span className='font-semibold text-[15px]'>{item.name}</span>
						</div>
						{isActive && (
							<motion.div layoutId='arrow'>
								<ArrowUpRight size={14} className='opacity-50' />
							</motion.div>
						)}
					</div>
				</Link>
			);
		})}
	</div>
);

// 2. مكون تبديل الثيم (تم نقله خارجاً لحل الخطأ)
const ThemeToggle = ({
	theme,
	setTheme,
}: {
	theme?: string;
	setTheme: (t: string) => void;
}) => (
	<button
		onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		className='h-8 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-full relative p-1 transition-colors'>
		<motion.div
			animate={{ x: theme === "dark" ? 24 : 0 }}
			className='h-6 w-6 bg-white dark:bg-blue-600 rounded-full shadow-sm flex items-center justify-center text-zinc-900 dark:text-white'>
			{theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
		</motion.div>
	</button>
);

// --- المكون الرئيسي ---

export function Sidebar() {
	const mounted = useIsMounted();
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	if (!mounted) return null;

	return (
		<>
			{/* MOBILE HEADER */}
			<div className='lg:hidden flex items-center justify-between p-5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-40 border-b border-zinc-200/50 dark:border-zinc-800/50'>
				<div className='flex items-center gap-3'>
					<div className='h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white'>
						<Command size={22} />
					</div>
					<span className='font-bold dark:text-white text-lg'>Admin</span>
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='icon' className='rounded-xl'>
							<Menu size={20} />
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-84 dark:bg-zinc-950 p-0'>
						<div className='p-6 h-full flex flex-col'>
							<SheetTitle className='flex items-center gap-3 text-2xl font-black italic'>
								<Command className='text-blue-600' /> CORE
							</SheetTitle>
							<NavLinks isMobile pathname={pathname} />
							<div className='mt-auto p-4'>
								<div className='bg-zinc-50 dark:bg-zinc-900 p-5 rounded-4xl border space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-xs font-bold text-zinc-400 uppercase'>
											Mode
										</span>
										<ThemeToggle theme={theme} setTheme={setTheme} />
									</div>
									<Button className='w-full rounded-2xl font-bold'>
										Logout
									</Button>
								</div>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* DESKTOP SIDEBAR */}
			<nav className='fixed left-3 top-3 bottom-3 z-50 hidden lg:flex flex-col w-70 rounded-[2.5rem] border bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm'>
				<div className='p-8'>
					<div className='flex items-center gap-4 bg-zinc-100/50 dark:bg-zinc-900/50 p-3 rounded-3xl border'>
						<div className='h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white'>
							<Command size={24} />
						</div>
						<div>
							<h2 className='font-bold text-sm dark:text-white'>Portfolio</h2>
							<p className='text-[11px] text-zinc-500 uppercase tracking-widest'>
								Admin v2.0
							</p>
						</div>
					</div>
				</div>

				<NavLinks pathname={pathname} />

				<div className='p-6 mt-auto'>
					<div className='bg-zinc-50 dark:bg-zinc-900 p-5 rounded-4xl border space-y-4'>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-bold text-zinc-400 uppercase'>
								Mode
							</span>
							<ThemeToggle theme={theme} setTheme={setTheme} />
						</div>
						<Button className='w-full rounded-2xl font-bold'>Logout</Button>
					</div>
				</div>
			</nav>
		</>
	);
}
