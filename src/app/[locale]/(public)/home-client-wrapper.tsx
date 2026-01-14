/** @format */
"use client";

import { useIsMounted } from "@/app/hooks/is-mounted";
import { BackgroundRippleEffect } from "@/components/background-ripple-effect";
import { cn } from "@/lib/utils";

export function HomeClientWrapper({ children }: { children: React.ReactNode }) {
	const isMounted = useIsMounted();

	if (!isMounted) return <div className='min-h-screen bg-background' />;

	return (
		<main className='relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden'>
			{/* REFINED BACKGROUND: Subtle grid with a soft radial fade */}
			<div className='fixed inset-0 z-0 pointer-events-none'>
				<div
					className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
					// style={{
					// 	backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
					// 	backgroundSize: "4rem 4rem",
					// }}
				/>
			</div>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,transparent_0%,var(--background)_90%)]' />
			<div className='absolute -z-10 inset-0 opacity-70 dark:opacity-50 pointer-events-none'>
				<BackgroundRippleEffect rows={112} cols={44} cellSize={60} />
			</div>
			{/* FLUID CONTAINER: Standardized horizontal and vertical rhythm */}
			<div
				className={cn(
					"relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24",
					"pb-24 md:pb-40",
				)}>
				{/* SECTION SPACING: Large, consistent gaps (Vertical Rhythm) */}
				<div className='flex flex-col space-y-32 md:space-y-48 lg:space-y-64'>
					{children}
				</div>
			</div>
		</main>
	);
}
