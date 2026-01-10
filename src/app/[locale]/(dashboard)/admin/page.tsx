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
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card"; // Assuming shadcn/ui
import { getUserRole } from "@/server/data/users";

export default async function DashboardPage({
	params,
}: {
	params: { locale: string };
}) {
	const { locale } = params;
	const session = await auth();
	const userRole = await getUserRole(session?.user?.id as string);

	// 1. Strict Server-Side Guard
	if (!session?.user || userRole !== UserRole.ADMIN) {
		redirect(`/auth/sign-in`);
	}

	// 2. Fetch Real Data from Prisma (Parallel fetching for speed)
	const [projectCount, pendingMessageCount, activeUsers] = await Promise.all([
		prisma.project.count(),
		prisma.contactMessage.count({
			where: {
				status: "UNREAD",
				// Senior tip: Exclude messages flagged as SPAM from the dashboard alert
				NOT: { status: "SPAM" },
			},
		}),
		prisma.user.count(),
	]);

	const stats = [
		{
			name: "Total Projects",
			value: projectCount,
			icon: Briefcase,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			name: "New Messages",
			value: pendingMessageCount,
			icon: Mail,
			color: "text-amber-500",
			bg: "bg-amber-500/10",
		},
		{
			name: "Total Users",
			value: activeUsers,
			icon: Eye,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
		},
	];

	return (
		<div className='p-6 space-y-8'>
			{/* Header Section */}
			<div>
				<h1 className='text-4xl font-extrabold tracking-tight dark:text-white'>
					Command Center
				</h1>
				<p className='text-muted-foreground mt-2 text-lg'>
					Welcome back, {session.user.name?.split(" ")[0]}.
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{stats.map((stat) => (
					<Card
						key={stat.name}
						className='p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-blue-500 transition-all'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>
									{stat.name}
								</p>
								<p className='text-4xl font-bold mt-2 tabular-nims'>
									{stat.value}
								</p>
							</div>
							<div className={`p-3 rounded-xl ${stat.bg}`}>
								<stat.icon className={`${stat.color} h-6 w-6`} />
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Middle Section: Chart & Quick Actions */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Chart Container */}
				<Card className='lg:col-span-2 p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold flex items-center gap-2'>
							<TrendingUp className='text-blue-500' size={20} />
							Engagement Overview
						</h2>
					</div>
					<div className='h-75 w-full'>
						<DashboardCharts />
					</div>
				</Card>

				{/* Sidebar Column */}
				<div className='space-y-6'>
					<Card className='p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30'>
						<h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
						<div className='flex flex-col gap-3'>
							<Link
								href={`/admin/projects`}
								className='flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-blue-600 hover:text-white rounded-xl transition-all group'>
								<div className='flex items-center gap-3'>
									<PlusCircle size={20} />
									<span>Post New Project</span>
								</div>
								<span className='group-hover:translate-x-1 transition-transform'>
									→
								</span>
							</Link>
							<Link
								href='/'
								target='_blank'
								className='flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-all'>
								<div className='flex items-center gap-3'>
									<Globe size={20} />
									<span>Launch Live Site</span>
								</div>
							</Link>
						</div>
					</Card>

					{/* Notification Card */}
					<div className='bg-blue-600/10 border border-blue-600/20 p-6 rounded-2xl'>
						<h3 className='text-blue-500 font-bold mb-2 uppercase text-xs tracking-widest'>
							Intelligence
						</h3>
						<p className='text-sm leading-relaxed'>
							You have{" "}
							<span className='font-bold text-blue-500'>
								{pendingMessageCount}
							</span>{" "}
							pending messages in your inbox.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
