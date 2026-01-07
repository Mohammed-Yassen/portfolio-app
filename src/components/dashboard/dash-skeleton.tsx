/** @format */
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "../ui/separator";
export function DashboardHeroSkeleton() {
	return (
		<div className='space-y-6 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800'>
			<div className='flex justify-between items-center mb-8'>
				<Skeleton className='h-8 w-48 rounded-lg' />
				<Skeleton className='h-10 w-32 rounded-xl' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Skeleton className='h-[300px] rounded-3xl' />
				<div className='md:col-span-2 space-y-4'>
					<Skeleton className='h-12 w-full rounded-xl' />
					<Skeleton className='h-12 w-full rounded-xl' />
					<Skeleton className='h-32 w-full rounded-xl' />
				</div>
			</div>
		</div>
	);
}

/**
 * A Reusable wrapper for standard form sections (Hero, About, Identity)
 * Reduces code duplication across your loaders.
 */
export function GenericSectionSkeleton() {
	return (
		<div className='space-y-8 animate-in fade-in duration-500'>
			<div className='flex flex-col gap-2'>
				<Skeleton className='h-8 w-48 rounded-lg' />
				<Skeleton className='h-4 w-72 rounded-lg opacity-60' />
			</div>

			<div className='p-1 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50 overflow-hidden'>
				<div className='p-8 space-y-8'>
					{/* Form Group 1 */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<div className='space-y-3'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-12 w-full rounded-2xl' />
						</div>
						<div className='space-y-3'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-12 w-full rounded-2xl' />
						</div>
					</div>

					{/* Form Group 2 (Textarea/Long content) */}
					<div className='space-y-3'>
						<Skeleton className='h-4 w-32' />
						<Skeleton className='h-40 w-full rounded-3xl' />
					</div>

					{/* Bottom Action Area */}
					<div className='pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800'>
						<Skeleton className='h-11 w-32 rounded-xl' />
					</div>
				</div>
			</div>
		</div>
	);
}

// Map standard skeletons to the generic one to keep your control-page.tsx imports working
export const HeroSkeletons = () => <GenericSectionSkeleton />;
export const DashboardAboutSkeleton = () => <GenericSectionSkeleton />;
export const IdentitySkeleton = () => <GenericSectionSkeleton />;

/**
 * Specialized Skeleton for the Skills/Experience Manager
 */
export const DashboardSkillSkeleton = () => {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-bottom-4 duration-700'>
			{/* LEFT SIDE: INPUT FORM SKELETON */}
			<div className='lg:col-span-5 space-y-6'>
				<Card className='border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-[2rem] overflow-hidden'>
					<CardHeader className='space-y-3 pb-8'>
						<Skeleton className='h-7 w-1/2 rounded-lg' />
						<Skeleton className='h-4 w-full rounded-lg opacity-70' />
					</CardHeader>
					<CardContent className='space-y-8'>
						{/* Fields */}
						{[1, 2].map((i) => (
							<div key={i} className='space-y-3'>
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-12 w-full rounded-xl' />
							</div>
						))}

						<Separator className='bg-zinc-100 dark:bg-zinc-800' />

						{/* List Area */}
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-9 w-20 rounded-lg' />
							</div>
							<div className='space-y-3'>
								{[1, 2].map((i) => (
									<div
										key={i}
										className='p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center gap-4'>
										<Skeleton className='h-4 w-4 rounded-full' />
										<Skeleton className='h-4 flex-1' />
										<Skeleton className='h-6 w-12 rounded-md' />
									</div>
								))}
							</div>
						</div>

						<Skeleton className='h-12 w-full mt-4 rounded-xl shadow-lg shadow-indigo-500/10' />
					</CardContent>
				</Card>
			</div>

			{/* RIGHT SIDE: PREVIEW/DATA LIST SKELETON */}
			<div className='lg:col-span-7 space-y-6'>
				<div className='flex items-center justify-between mb-2'>
					<Skeleton className='h-6 w-32' />
					<Skeleton className='h-4 w-24' />
				</div>
				<div className='grid grid-cols-1 gap-4'>
					{[1, 2, 3, 4, 5].map((i) => (
						<Card
							key={i}
							className='border-none bg-zinc-100/50 dark:bg-zinc-900/50 p-5 rounded-2xl flex items-center justify-between group'>
							<div className='flex items-center gap-5'>
								{/* Visual Mockup of an Icon/Image */}
								<Skeleton className='h-14 w-14 rounded-2xl shrink-0 shadow-sm' />
								<div className='space-y-3'>
									<Skeleton className='h-5 w-44 rounded-lg' />
									<div className='flex gap-2'>
										<Skeleton className='h-5 w-16 rounded-full' />
										<Skeleton className='h-5 w-20 rounded-full' />
										<Skeleton className='h-5 w-12 rounded-full opacity-60' />
									</div>
								</div>
							</div>
							<div className='flex gap-2 shrink-0'>
								<Skeleton className='h-10 w-10 rounded-xl' />
								<Skeleton className='h-10 w-10 rounded-xl' />
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};
/** @format */

export function DashboardSkeleton() {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
			{/* Left: List Skeleton */}
			<div className='lg:col-span-5 space-y-4'>
				<Skeleton className='h-10 w-full rounded-lg' />
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className='p-4 border rounded-xl space-y-3'>
						<div className='flex justify-between'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-4 w-12' />
						</div>
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-4 w-full' />
					</div>
				))}
			</div>

			{/* Right: Form Area Skeleton */}
			<div className='lg:col-span-7'>
				<div className='border rounded-3xl h-[600px] p-6 space-y-6'>
					<div className='flex justify-between items-center'>
						<Skeleton className='h-8 w-40' />
						<Skeleton className='h-8 w-8 rounded-full' />
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<Skeleton className='h-12 w-full' />
						<Skeleton className='h-12 w-full' />
					</div>
					<Skeleton className='h-24 w-full' />
					<Skeleton className='h-64 w-full' />
				</div>
			</div>
		</div>
	);
}
