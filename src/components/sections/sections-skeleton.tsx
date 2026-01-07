/** @format */

import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
	return (
		<div className='container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
			<div className='lg:col-span-7 space-y-8'>
				<Skeleton className='h-6 w-40 rounded-full' />
				<div className='space-y-4'>
					<Skeleton className='h-16 w-[80%]' />
					<Skeleton className='h-10 w-[60%]' />
					<Skeleton className='h-20 w-full' />
				</div>
				<div className='flex gap-4'>
					<Skeleton className='h-12 w-32 rounded-full' />
					<Skeleton className='h-12 w-32 rounded-full' />
				</div>
			</div>
			<div className='lg:col-span-5 flex justify-center'>
				<Skeleton className='h-64 w-64 md:h-80 md:w-80 rounded-full' />
			</div>
		</div>
	);
}

export const AboutSkeleton = () => {
	return (
		<section className='py-24 bg-muted/20'>
			<div className='container mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
					{/* Left Column: Text Content Skeleton */}
					<div className='space-y-6'>
						<div className='space-y-3'>
							<Skeleton className='h-10 w-3/4' /> {/* Title Line 1 */}
							<Skeleton className='h-10 w-1/2' /> {/* Title Line 2 */}
						</div>

						<div className='space-y-2'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-2/3' />
						</div>

						<div className='space-y-2 pt-4'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-5/6' />
						</div>

						{/* Stats Skeleton */}
						<div className='grid grid-cols-2 gap-6 pt-8'>
							<div className='border-l-2 border-muted pl-4 space-y-2'>
								<Skeleton className='h-8 w-12' />
								<Skeleton className='h-4 w-16' />
							</div>
							<div className='border-l-2 border-muted pl-4 space-y-2'>
								<Skeleton className='h-8 w-12' />
								<Skeleton className='h-4 w-16' />
							</div>
						</div>
					</div>

					{/* Right Column: Core Pillars Skeleton */}
					<div className='space-y-4'>
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className='p-6 rounded-2xl border bg-card flex gap-4'>
								{/* Icon Skeleton */}
								<Skeleton className='h-12 w-12 rounded-xl shrink-0' />

								{/* Text Skeleton */}
								<div className='space-y-2 w-full'>
									<Skeleton className='h-6 w-32' />
									<Skeleton className='h-4 w-full' />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export const SkillsSkeleton = () => {
	return (
		<section className='py-24 bg-background'>
			<div className='container mx-auto px-6 md:px-12'>
				{/* Header Skeleton */}
				<div className='text-center max-w-2xl mx-auto mb-16 space-y-4'>
					<Skeleton className='h-10 w-64 mx-auto' />
					<Skeleton className='h-4 w-full max-w-md mx-auto' />
				</div>

				{/* Grid Skeleton */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{/* Generate 4 skeleton cards */}
					{[...Array(4)].map((_, i) => (
						<div key={i} className='p-6 rounded-2xl border bg-card/50'>
							<div className='flex items-center gap-3 mb-6'>
								{/* Icon Circle */}
								<Skeleton className='h-10 w-10 rounded-lg' />
								{/* Category Title */}
								<Skeleton className='h-6 w-24' />
							</div>

							{/* Skill List Skeletons */}
							<div className='space-y-4'>
								{[...Array(5)].map((_, j) => (
									<div key={j} className='flex items-center'>
										<Skeleton className='h-1.5 w-1.5 rounded-full mr-3' />
										<Skeleton className='h-4 w-full' />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export function ProjectsSkeleton() {
	return (
		<section className='py-24 bg-background relative overflow-hidden'>
			<div className='absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none' />

			<div className='container mx-auto px-6 md:px-12'>
				{/* Header Skeleton */}
				<div className='flex flex-col md:flex-row justify-between items-center mb-16 gap-6'>
					<div className='space-y-3 w-full md:w-auto'>
						<Skeleton className='h-10 w-64 mx-auto md:mx-0' />
						<Skeleton className='h-6 w-full max-w-xl mx-auto md:mx-0' />
					</div>
					<Skeleton className='h-10 w-32 rounded-full' />
				</div>

				{/* Grid Skeleton */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className='bg-card border rounded-3xl overflow-hidden flex flex-col h-[500px]'>
							{/* Image Section */}
							<Skeleton className='h-56 w-full rounded-none' />

							{/* Content Section */}
							<div className='p-6 space-y-4 grow flex flex-col'>
								<div className='flex items-center gap-2'>
									<Skeleton className='h-8 w-8 rounded-lg' />
									<Skeleton className='h-4 w-20' />
								</div>
								<Skeleton className='h-7 w-3/4' />
								<div className='space-y-2'>
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-4 w-5/6' />
								</div>
								{/* Tech Stack */}
								<div className='flex flex-wrap gap-1.5 py-2'>
									<Skeleton className='h-5 w-12' />
									<Skeleton className='h-5 w-16' />
									<Skeleton className='h-5 w-14' />
								</div>
								{/* Footer Actions */}
								<div className='pt-4 flex items-center gap-3 border-t mt-auto'>
									<Skeleton className='h-9 flex-1 rounded-xl' />
									<Skeleton className='h-9 w-9 rounded-xl' />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
/** @format */

export const ExperienceSkeleton = () => (
	<section className='py-24 bg-background'>
		<div className='container mx-auto px-6 max-w-6xl'>
			<div className='grid md:grid-cols-2 gap-16'>
				{[1, 2].map((col) => (
					<div key={col} className='space-y-12'>
						{/* Title Skeleton */}

						<div className='flex items-center gap-4'>
							<div className='w-12 h-12 rounded-xl bg-muted animate-pulse' />

							<div className='w-48 h-8 bg-muted animate-pulse rounded-lg' />
						</div>

						{/* Timeline Skeleton */}

						<div className='relative border-l-2 border-muted ml-4 space-y-12'>
							{[1, 2].map((item) => (
								<div key={item} className='relative pl-10'>
									<div className='absolute w-5 h-5 bg-muted rounded-full -left-[11px] top-1' />

									<div className='space-y-4 p-6 rounded-2xl border border-muted/20'>
										<div className='w-32 h-4 bg-muted animate-pulse rounded' />

										<div className='w-full h-6 bg-muted animate-pulse rounded' />

										<div className='w-2/3 h-4 bg-muted animate-pulse rounded' />

										<div className='space-y-2 pt-2 border-t border-muted/50'>
											<div className='w-full h-3 bg-muted animate-pulse rounded' />

											<div className='w-full h-3 bg-muted animate-pulse rounded' />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
);

/** @format */

export const CertificationsSkeleton = () => (
	<section className='py-24 bg-background'>
		<div className='container mx-auto px-6 max-w-7xl'>
			<div className='text-center mb-16 space-y-4'>
				<div className='w-64 h-10 bg-muted animate-pulse rounded-lg mx-auto' />

				<div className='w-96 h-4 bg-muted animate-pulse rounded mx-auto' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className='h-[350px] bg-muted/20 border border-muted rounded-3xl p-8 flex flex-col'>
						<div className='flex justify-between items-start mb-6'>
							<div className='w-16 h-16 bg-muted animate-pulse rounded-2xl' />

							<div className='w-20 h-6 bg-muted animate-pulse rounded-full' />
						</div>

						<div className='space-y-3 flex-grow'>
							<div className='w-full h-8 bg-muted animate-pulse rounded' />

							<div className='w-1/2 h-4 bg-muted animate-pulse rounded' />

							<div className='w-1/3 h-3 bg-muted animate-pulse rounded' />
						</div>

						<div className='pt-6 border-t border-muted flex justify-between items-end'>
							<div className='space-y-2'>
								<div className='w-20 h-2 bg-muted rounded' />

								<div className='w-32 h-4 bg-muted rounded' />
							</div>

							<div className='w-10 h-10 bg-muted rounded-xl animate-pulse' />
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
);

/** @format */

export const BlogSkeleton = () => (
	<section className='py-24 bg-background'>
		<div className='container mx-auto px-6 max-w-7xl'>
			<div className='flex justify-between items-end mb-16'>
				<div className='w-64 h-12 bg-muted animate-pulse rounded-lg' />

				<div className='w-32 h-6 bg-muted animate-pulse rounded' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
				{[1, 2, 3].map((i) => (
					<div key={i} className='space-y-4'>
						<div className='aspect-video bg-muted animate-pulse rounded-3xl' />

						<div className='flex gap-2'>
							<div className='w-16 h-5 bg-muted rounded-full' />

							<div className='w-16 h-5 bg-muted rounded-full' />
						</div>

						<div className='w-full h-8 bg-muted animate-pulse rounded' />

						<div className='w-2/3 h-4 bg-muted animate-pulse rounded' />
					</div>
				))}
			</div>
		</div>
	</section>
);

/** @format */

export const ServicesSkeleton = () => (
	<section className='py-24 bg-muted/10'>
		<div className='container mx-auto px-6'>
			<div className='text-center mb-16 space-y-4'>
				<div className='w-64 h-10 bg-muted animate-pulse rounded-lg mx-auto' />

				<div className='w-96 h-4 bg-muted animate-pulse rounded mx-auto' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className='p-8 rounded-3xl border border-muted bg-background space-y-8'>
						<div className='mx-auto w-12 h-12 bg-muted animate-pulse rounded-2xl' />

						<div className='space-y-2 text-center'>
							<div className='w-48 h-6 bg-muted animate-pulse mx-auto rounded' />

							<div className='w-full h-4 bg-muted animate-pulse mx-auto rounded' />
						</div>

						<div className='space-y-4'>
							{[1, 2, 3, 4].map((f) => (
								<div key={f} className='flex gap-3'>
									<div className='w-4 h-4 bg-muted rounded-full' />

									<div className='w-full h-4 bg-muted rounded' />
								</div>
							))}
						</div>

						<div className='w-full h-12 bg-muted animate-pulse rounded-xl' />
					</div>
				))}
			</div>
		</div>
	</section>
);
export const TestimonialsSkeleton = () => (
	<div className='max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-20 animate-pulse'>
		<div className='relative grid grid-cols-1 md:grid-cols-2 gap-20'>
			<div className='h-80 w-full bg-muted rounded-3xl' />
			<div className='flex flex-col justify-between py-4'>
				<div className='space-y-4'>
					<div className='h-8 w-48 bg-muted rounded' />
					<div className='h-4 w-32 bg-muted rounded' />
					<div className='space-y-2 mt-8'>
						<div className='h-4 w-full bg-muted rounded' />
						<div className='h-4 w-full bg-muted rounded' />
						<div className='h-4 w-2/3 bg-muted rounded' />
					</div>
				</div>
				<div className='flex gap-4 pt-12 md:pt-0'>
					<div className='h-10 w-10 rounded-full bg-muted' />
					<div className='h-10 w-10 rounded-full bg-muted' />
				</div>
			</div>
		</div>
	</div>
);
export function FooterSkeleton() {
	return (
		<footer className='w-full border-t bg-zinc-50/50 dark:bg-zinc-900/50 py-12'>
			<div className='container mx-auto px-6'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
					{/* Brand Info */}
					<div className='col-span-1 md:col-span-1 space-y-4'>
						<Skeleton className='h-10 w-32' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-2/3' />
					</div>

					{/* Quick Links */}
					<div className='space-y-4'>
						<Skeleton className='h-6 w-24' />
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-16' />
					</div>

					{/* Contact Info */}
					<div className='space-y-4'>
						<Skeleton className='h-6 w-24' />
						<Skeleton className='h-4 w-32' />
						<Skeleton className='h-4 w-40' />
					</div>

					{/* Socials */}
					<div className='space-y-4'>
						<Skeleton className='h-6 w-24' />
						<div className='flex gap-4'>
							<Skeleton className='h-10 w-10 rounded-full' />
							<Skeleton className='h-10 w-10 rounded-full' />
							<Skeleton className='h-10 w-10 rounded-full' />
						</div>
					</div>
				</div>

				<div className='mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4'>
					<Skeleton className='h-4 w-48' />
					<Skeleton className='h-4 w-32' />
				</div>
			</div>
		</footer>
	);
}
