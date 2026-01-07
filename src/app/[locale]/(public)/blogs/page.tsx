/** @format */
import { BlogCard } from "@/components/blog-card";
import { MotionViewport } from "@/components/motion-viewport";
import { BackButton } from "@/components/back-button";
import { getBlogs } from "@/server/data/blogs";
import { Locale } from "@prisma/client";
import prisma from "@/lib/prisma";
interface Props {
	params: Promise<{ locale: Locale }>;
}

export default async function BlogPage({ params }: Props) {
	const { locale } = await params;

	// Parallelized fetch for high-speed page loading
	const blogs = await getBlogs(locale);

	// Flatten translations for cleaner prop drilling
	

	return (
		<main className='min-h-screen bg-background selection:bg-primary/10'>
			{/* 1. Sticky Navigation Bar */}
			<nav className='fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
				<div className='container max-w-7xl mx-auto h-16 flex items-center justify-between px-6'>
					<BackButton
						title='Back to home'
						fallback='/'
						variant='ghost'
						className='hover:bg-transparent -ml-2'
					/>

					{/* Senior Tip: Add a small status indicator or breadcrumb here */}
					<div className='hidden md:block text-xs font-medium uppercase tracking-widest text-muted-foreground/60'>
						Blog Archive / {blogs.length} Articles
					</div>
				</div>
			</nav>

			{/* 2. Main Content Area */}
			<div className='container mx-auto px-6 max-w-7xl pt-32 pb-24'>
				<header className='max-w-4xl mb-24'>
					<MotionViewport preset='fadeInUp'>
						<div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6'>
							Latest Insights
						</div>
						<h1 className='text-5xl md:text-8xl font-bold tracking-tight mb-8'>
							Engineering <span className='text-primary italic'>/</span>{" "}
							Insights
						</h1>
						<p className='text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl'>
							Exploring the intersection of cloud architecture, user experience,
							and the future of the web.
						</p>
					</MotionViewport>
				</header>

				{/* 3. Responsive Grid */}
				<section>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
						{blogs.map((blog, i) => (
							// <BlogCard key={blogs.id} post={post} index={i} />
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
