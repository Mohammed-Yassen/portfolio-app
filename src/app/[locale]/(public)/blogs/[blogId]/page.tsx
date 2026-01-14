/** @format */
import { notFound } from "next/navigation";
import { Clock, Share2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

import { getBlogById } from "@/server/data/blogs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/back-button";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Locale } from "@prisma/client";
import { MotionSection } from "@/components/shared/motion-viewport";
import ReadingProgress from "@/components/reading-progress";
import { EditorContent } from "@/components/editor-content";

const calculateReadTime = (content: string) => {
	const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
	return Math.ceil(words / 200);
};

export default async function BlogDetailPage({
	params,
}: {
	params: Promise<{ blogId: string; locale: Locale }>;
}) {
	const { blogId, locale } = await params;
	const post = await getBlogById(blogId, locale);

	if (!post) notFound();

	const t = await getTranslations("BlogDetail");
	const isAr = locale === "ar";
	const dateLocale = isAr ? arSA : enUS;
	const readTime = calculateReadTime(post.content);

	return (
		<div
			className='min-h-screen bg-background pb-24 selection:bg-primary/10'
			dir={isAr ? "rtl" : "ltr"}>
			<ReadingProgress />

			{/* Navigation */}
			<nav className='fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50 py-3'>
				<div className='container mx-auto px-6 max-w-5xl flex justify-between items-center'>
					<BackButton
						title={t("backToHome")}
						variant='ghost'
						className={cn("hover:bg-transparent", isAr ? "-mr-2" : "-ml-2")}
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
					<MotionSection preset='fadeInUp'>
						<div className='flex items-center gap-2 mb-6'>
							<span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest'>
								{post.categoryName}
							</span>
						</div>

						<h1
							className={cn(
								"text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.05] text-balance",
								isAr && "font-sans tracking-normal",
							)}>
							{post.title}
						</h1>

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
												? format(new Date(post.publishedAt), "MMM dd, yyyy", {
														locale: dateLocale,
												  })
												: t("draft")}
										</time>
										<span>•</span>
										<span className='flex items-center gap-1'>
											<Clock size={12} /> {readTime} {t("readTime")}
										</span>
									</div>
								</div>
							</div>
							<button className='text-muted-foreground hover:text-foreground'>
								<MoreHorizontal size={20} />
							</button>
						</div>
					</MotionSection>
				</header>

				{/* Hero Image */}
				<div className='container mx-auto px-6 max-w-5xl mb-16'>
					<MotionSection
						preset='scaleUp'
						className='relative rounded-2xl overflow-hidden shadow-sm border bg-muted'>
						<Image
							src={post.image || "/placeholder.jpg"}
							alt={post.title}
							width={1200}
							height={600}
							unoptimized
							className='w-full aspect-21/9 object-cover'
						/>
					</MotionSection>
				</div>

				{/* Main Content Body */}
				<div className='container mx-auto px-6 max-w-185'>
					<EditorContent content={post.content} />
				</div>
				{/* Y&q%sGm*82a5GJ-#: */}
			</article>
		</div>
	);
}
