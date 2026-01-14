/** @format */
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "@/components/dashboard/user/user-tables";
import { StatsCards } from "@/components/dashboard/user/status-card";
import { ProfileForm } from "@/components/dashboard/user/profile-form";

// Import our clean data fetchers
import {
	getUserWithProfile,
	getAllUsersWithProfiles,
} from "@/server/data/users";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { protectSuperAdmin } from "@/lib/admin-guard";
interface AdminPageProps {
	params: Promise<{ locale: string }>;
}
export default async function AdminUsersPage({ params }: AdminPageProps) {
	const { locale } = await params;
	const session = await protectSuperAdmin();

	const user = await getUserWithProfile(session?.user?.id as string);
	console.log("UserWithProfile ", user);

	// 2. Optimized Parallel Data Loading
	const [users, totalUsers, adminCount] = await Promise.all([
		getAllUsersWithProfiles(),
		prisma.user.count(),
		prisma.user.count({ where: { role: UserRole.ADMIN } }),
	]);

	// 3. Resilience Check
	if (!user) {
		return redirect("/auth/sign-in");
	}

	return (
		<div className='flex-1 space-y-8 p-8 pt-6'>
			<header className='flex flex-col gap-2'>
				<h2 className='text-3xl font-bold tracking-tight'>Administration</h2>
				<p className='text-muted-foreground'>
					Overview of system performance and account synchronization.
				</p>
			</header>

			<StatsCards total={totalUsers} admins={adminCount} newThisMonth={0} />

			<Separator />

			<Tabs defaultValue='overview' className='space-y-6'>
				<TabsList className='bg-muted/50 p-1 border'>
					<TabsTrigger value='overview' className='px-6'>
						User Directory
					</TabsTrigger>
					<TabsTrigger value='profile' className='px-6'>
						My Admin Settings
					</TabsTrigger>
				</TabsList>

				{/* Directory Tab */}
				<TabsContent
					value='overview'
					className='animate-in fade-in-50 duration-500 outline-none'>
					<div className='rounded-xl border bg-card shadow-sm'>
						<UsersTable data={users} />
					</div>
				</TabsContent>

				{/* Personal Profile Tab */}
				<TabsContent
					value='profile'
					className='animate-in slide-in-from-bottom-2 duration-400 outline-none'>
					<ProfileForm initialData={user} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
