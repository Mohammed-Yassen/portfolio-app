/** @format */
"use client";

import { useIsMounted } from "@/app/hooks/is-mounted";

export function HomeClientWrapper({ children }: { children: React.ReactNode }) {
	const isMounted = useIsMounted();

	if (!isMounted) {
		return <div className='min-h-screen bg-background' />;
	}

	return (
		<main className='relative bg-background text-foreground min-h-screen selection:bg-primary/30 pb-16 md:pb-24'>
			{/* Global background effects */}
			<div
				className='absolute inset-0 z-0 opacity-[0.05] pointer-events-none'
				style={{
					backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
					backgroundSize: "3rem 3rem",
				}}
			/>

			<div className='relative z-10'>{children}</div>
		</main>
	);
}
