/** @format */
// src/app/[locale]/admin/layout.tsx

import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>; // Change to Promise
}) {
	// Await params for Next.js 15
	const { locale } = await params;
	const isRtl = locale === "ar";

	return (
		<div
			dir={isRtl ? "rtl" : "ltr"}
			className='min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500'>
			{/* Pass the awaited locale */}
			<Sidebar locale={locale} />

			{/* lg:ps-72 works perfectly with the dir attribute.
                When dir="rtl", ps (padding-start) applies to the RIGHT.
                When dir="ltr", ps applies to the LEFT.
            */}
			<main className='transition-all duration-300 lg:ps-72 p-4 lg:p-8'>
				<div className='max-w-7xl mx-auto'>{children}</div>
			</main>
		</div>
	);
}
