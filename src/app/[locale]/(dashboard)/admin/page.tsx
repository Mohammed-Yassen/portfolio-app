/** @format */
import {
	Briefcase,
	Mail,
	Eye,
	PlusCircle,
	Globe,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import DashboardCharts from "@/components/dashboard/chart";

export default async function DashboardPage() {
	// Fetch Real Data from Supabase
	// const [projectCount, messageCount] = await Promise.all([
	// 	db.project.count(),
	// 	db.contactMessage.count({ where: { status: "UNREAD" } }),
	// ]);

	const stats = [
		{
			name: "Total Projects",
			value: 22,
			icon: Briefcase,
			color: "text-blue-600 dark:text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			name: "Inbox",
			value: 3,
			icon: Mail,
			color: "text-amber-600 dark:text-amber-500",
			bg: "bg-amber-500/10",
		},
		{
			name: "Profile Views",
			value: 1240,
			icon: Eye,
			color: "text-emerald-600 dark:text-emerald-500",
			bg: "bg-emerald-500/10",
		},
	];

	return (
		<div className='p-4 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-300'>
			{/* Header Section */}
			<div className='flex justify-between items-end'>
				<div>
					<h1 className='text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white'>
						Command Center
					</h1>
					<p className='text-zinc-500 dark:text-zinc-400 mt-2 text-lg'>
						Welcome back, Mohammed.
					</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{stats.map((stat) => (
					<div
						key={stat.name}
						className='group bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 shadow-sm dark:shadow-none'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-zinc-500 dark:text-zinc-500 text-sm font-medium uppercase tracking-wider'>
									{stat.name}
								</p>
								<p className='text-4xl font-bold mt-2 tabular-nums text-zinc-900 dark:text-white'>
									{stat.value}
								</p>
							</div>
							<div className={`p-3 rounded-xl ${stat.bg}`}>
								<stat.icon className={`${stat.color} h-6 w-6`} />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Middle Section: Chart & Quick Actions */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Chart Container */}
				<div className='lg:col-span-2 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold flex items-center gap-2 text-zinc-900 dark:text-white'>
							<TrendingUp className='text-blue-500' size={20} />
							Engagement Overview
						</h2>
					</div>
					<div className='h-[300px] w-full'>
						<DashboardCharts />
					</div>
				</div>

				{/* Quick Actions Column */}
				<div className='space-y-6'>
					<div className='bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm'>
						<h2 className='text-xl font-semibold mb-4 text-zinc-900 dark:text-white'>
							Quick Actions
						</h2>
						<div className='flex flex-col gap-3'>
							<Link
								href='/dashboard/projects/new'
								className='flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-blue-600 hover:text-white dark:text-white rounded-xl transition-all group'>
								<div className='flex items-center gap-3'>
									<PlusCircle size={20} />
									<span>Post New Project</span>
								</div>
								<span>→</span>
							</Link>
							<Link
								href='/'
								target='_blank'
								className='flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:text-white rounded-xl transition-all'>
								<div className='flex items-center gap-3'>
									<Globe size={20} />
									<span>Launch Live Site</span>
								</div>
							</Link>
						</div>
					</div>

					{/* Notification Card */}
					<div className='bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-600/20 p-6 rounded-2xl'>
						<h3 className='text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase text-xs tracking-widest'>
							Intelligence
						</h3>
						<p className='text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed'>
							You have{" "}
							<span className='font-bold text-blue-700 dark:text-white'>
								{4}
							</span>{" "}
							pending messages.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
