/** @format */
"use client";

import { useIsMounted } from "@/app/hooks/is-mounted";
import { cn } from "@/lib/utils";

export function HomeClientWrapper({ children }: { children: React.ReactNode }) {
	const isMounted = useIsMounted();

	if (!isMounted) {
		return <div className='min-h-screen bg-background' />;
	}

	return (
		<main className='relative min-h-screen bg-background text-foreground selection:bg-primary/30'>
			{/* MODERN GRID BACKGROUND
               - Dark Mode: Subtle grey lines
               - Light Mode: Slightly darker, defined lines to prevent 'ugly' blurring
            */}
			<div
				className='fixed inset-0 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.04]'
				style={{
					backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px), 
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
					backgroundSize: "3.5rem 3.5rem",
				}}
			/>

			{/* Added a subtle radial fade so the grid isn't "everywhere" with the same intensity */}
			<div className='fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]' />

			<div
				className={cn(
					"relative z-10 mx-auto w-full max-w-7xl container",
					"px-6 md:px-10 lg:px-12",
					"pb-16 md:pb-24",
				)}>
				{children}
			</div>
		</main>
	);
}
