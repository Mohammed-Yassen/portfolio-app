/** @format */
import { BlogCard } from "@/components/blog-card";
import { BackButton } from "@/components/back-button";
import { getBlogs } from "@/server/data/blogs";
import { Locale } from "@prisma/client";
import { MotionSection } from "@/components/shared/motion-viewport";
import { getTranslations } from "next-intl/server"; // Import for server components

interface Props {
	params: Promise<{ locale: Locale }>;
}

export default async function BlogPage({ params }: Props) {
	const { locale } = await params;

	// Initialize translations for the "Blog" namespace
	const t = await getTranslations("Blog");
	const common = await getTranslations("Common");

	// Fetch blogs filtered by locale from DB
	const blogs = await getBlogs(locale);

	return (
		<main className='min-h-screen bg-background selection:bg-primary/10'>
			{/* 1. Sticky Navigation Bar */}
			<nav className='fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
				<div className='container max-w-7xl mx-auto h-16 flex items-center justify-between px-6'>
					<BackButton
						title={common("backToHome")} // Translated
						fallback='/'
						variant='ghost'
						className='hover:bg-transparent -ml-2'
					/>

					<div className='hidden md:block text-xs font-medium uppercase tracking-widest text-muted-foreground/60'>
						{t("archive")} / {blogs.length} {t("articlesCount")}
					</div>
				</div>
			</nav>

			{/* 2. Main Content Area */}
			<div className='container mx-auto px-6 max-w-7xl pt-32 pb-24'>
				<header className='max-w-4xl mb-24'>
					<MotionSection as='section' preset='fadeInUp'>
						<div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6'>
							{t("badge")}
						</div>
						<h1 className='text-5xl md:text-8xl font-bold tracking-tight mb-8 uppercase'>
							{t("titlePart1")} <span className='text-primary italic'>/</span>{" "}
							{t("titlePart2")}
						</h1>
						<p className='text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl'>
							{t("description")}
						</p>
					</MotionSection>
				</header>

				{/* 3. Responsive Grid */}
				<section>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
						{blogs.map((blog, i) => (
							<BlogCard key={blog.id} post={blog} locale={locale} index={i} />
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
