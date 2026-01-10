/** @format */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn } from "lucide-react";
import { LanguageToggle } from "./shared/language-toggle";

export function HomeHeader({ user }: { user: unknown }) {
	return (
		<header className='absolute top-0 left-0 w-full z-60 p-6 flex justify-end'>
			<div className='flex items-center gap-4'>
				<LanguageToggle />
				{!user ? (
					<Button
						asChild
						variant='ghost'
						className='rounded-full px-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all'>
						<Link href='/auth/sign-in' className='flex items-center gap-2'>
							<LogIn size={16} />
							Login
						</Link>
					</Button>
				) : (
					<Button
						asChild
						className='rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95'>
						<Link href='/admin' className='flex items-center gap-2'>
							<LayoutDashboard size={16} />
							Dashboard
						</Link>
					</Button>
				)}
			</div>
		</header>
	);
}
