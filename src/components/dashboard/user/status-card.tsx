/** @format */

// components/admin/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, UserPlus } from "lucide-react";

export function StatsCards({
	total,
	admins,
}: {
	total: number;
	admins: number;
	newThisMonth?: number;
}) {
	return (
		<div className='grid gap-4 md:grid-cols-3'>
			<Card className='hover:border-primary/50 transition-colors'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Total Users</CardTitle>
					<Users className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{total}</div>
				</CardContent>
			</Card>
			<Card className='hover:border-primary/50 transition-colors'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Administrators</CardTitle>
					<ShieldCheck className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{admins}</div>
				</CardContent>
			</Card>
			<Card className='hover:border-primary/50 transition-colors'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Growth</CardTitle>
					<UserPlus className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>+12%</div>
				</CardContent>
			</Card>
		</div>
	);
}
