/** @format */

import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
			<Sidebar />
			{/* On Desktop: pl-[300px] (Sidebar 64px + margins)
         On Mobile: p-4 
      */}
			<main className='transition-all duration-300 lg:pl-70 p-4 lg:p-8 lg:pr-8'>
				<div className='max-w-7xl mx-auto'>{children}</div>
			</main>
		</div>
	);
}
