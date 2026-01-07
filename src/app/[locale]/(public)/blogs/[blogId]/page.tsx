/** @format */
import { notFound } from "next/navigation";
import {
	Calendar,
	Clock,
	ArrowLeft,
	Share2,
	MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { MotionViewport } from "@/components/motion-viewport";
import { getBlogById } from "@/data/blogs";
import ReadingProgress from "@/components/reading-progress";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/back-button";

// Dynamic read time based on word count (approx 200 wpm)
const calculateReadTime = (content: string) => {
	const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
	return Math.ceil(words / 200);
};

export default async function BlogDetailPage({
	params,
}: {
	params: Promise<{ blogId: string }>;
}) {
	const { blogId } = await params;
	const post = await getBlogById(blogId);

	if (!post) notFound();

	const readTime = calculateReadTime(post.content);

	return (
		<div className='min-h-screen bg-background pb-24 selection:bg-primary/10'>
			<ReadingProgress />

			{/* Navigation - Ultra Clean */}
			<nav className='fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50 py-3'>
				<div className='container mx-auto px-6 max-w-5xl flex justify-between items-center'>
					<BackButton
						title='Back to home'
						// fallback='/'
						variant='ghost'
						className='hover:bg-transparent -ml-2'
					/>
					<div className='flex items-center gap-4'>
						<button className='p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground'>
							<Share2 size={20} />
						</button>
					</div>
				</div>
			</nav>

			<article className='pt-32'>
				{/* Header Section */}
				<header className='container mx-auto px-6 max-w-3xl mb-12'>
					<MotionViewport preset='fadeInUp'>
						<div className='flex items-center gap-2 mb-6'>
							<span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest'>
								{post.category}
							</span>
						</div>

						<h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.05] text-balance'>
							{post.title}
						</h1>

						{/* Author/Meta Section - Medium Style */}
						<div className='flex items-center justify-between border-y border-border/60 py-6 mb-12'>
							<div className='flex items-center gap-3'>
								<Avatar className='h-10 w-10 border'>
									<AvatarImage src='/author-avatar.png' />
									<AvatarFallback>GG</AvatarFallback>
								</Avatar>
								<div className='flex flex-col'>
									<span className='text-sm font-bold'>Ghanem Ghalib</span>
									<div className='flex items-center gap-2 text-xs text-muted-foreground'>
										<time dateTime={post.publishedAt?.toString()}>
											{post.publishedAt
												? format(new Date(post.publishedAt), "MMM dd, yyyy")
												: "Draft"}
										</time>
										<span>•</span>
										<span className='flex items-center gap-1'>
											<Clock size={12} /> {readTime} min read
										</span>
									</div>
								</div>
							</div>
							<button className='text-muted-foreground hover:text-foreground'>
								<MoreHorizontal size={20} />
							</button>
						</div>
					</MotionViewport>
				</header>

				{/* Hero Image */}
				<div className='container mx-auto px-6 max-w-5xl mb-16'>
					<MotionViewport
						preset='scaleUp'
						className='relative rounded-2xl overflow-hidden shadow-sm border bg-muted'>
						<img
							src={post.image || "/placeholder.jpg"}
							alt={post.title}
							className='w-full aspect-[21/9] object-cover'
						/>
					</MotionViewport>
				</div>

				{/* Main Content Body */}
				<div className='container mx-auto px-6 max-w-[740px]'>
					<div
						className={cn(
							"prose prose-lg dark:prose-invert max-w-none",
							// Content Typography: Serif is key for the "Medium" feel
							"prose-p:font-serif prose-p:text-[21px] prose-p:leading-[1.6] prose-p:mb-8 prose-p:text-zinc-800 dark:prose-p:text-zinc-200",
							// Headings Styling
							"prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tighter prose-headings:mt-12 prose-headings:mb-6",
							"prose-h2:text-3xl prose-h3:text-2xl",
							// Diagram/Image Handling (Crucial for your Transformer images)
							"prose-img:rounded-xl prose-img:shadow-none prose-img:my-10 prose-img:mx-auto prose-img:border prose-img:border-border/40",
							// Code Block refinement (Fixing your dark screenshot issue)
							"prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8",
							"prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
							// Quotes
							"prose-blockquote:border-l-primary prose-blockquote:border-l-[3px] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:text-zinc-500 prose-blockquote:font-serif",
						)}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					{/* Tags Footer */}
					<div className='mt-16 pt-8 border-t flex flex-wrap gap-2'>
						{post.category && (
							<span className='px-3 py-1 bg-muted rounded-full text-xs font-medium hover:bg-secondary cursor-pointer transition-colors'>
								#{post.category.toLowerCase()}
							</span>
						)}
					</div>
				</div>
			</article>
		</div>
	);
}
