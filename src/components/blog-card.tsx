/** @format */
"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { MotionSection } from "./shared/motion-viewport";
import { TransformedBlog } from "@/types/blog-types";
import { Locale } from "@prisma/client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BlogCardProps {
	post: TransformedBlog;
	index: number;
	locale: Locale;
}

export function BlogCard({ post, locale, index = 0 }: BlogCardProps) {
	const t = useTranslations("BlogCard");
	const isAr = locale.toLowerCase() === "ar";
	const dateLocale = isAr ? arSA : enUS;
	const readTime = Math.ceil(post.content.length / 1000) || 1;

	return (
		<MotionSection
			preset='fadeInUp'
			delay={index * 0.1}
			className='group flex flex-col h-full bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden'
			dir={isAr ? "rtl" : "ltr"}>
			{/* Image Container with strict Aspect Ratio */}
			<Link
				href={`/${locale.toLowerCase()}/blogs/${post.id}`}
				className='relative aspect-16/10 overflow-hidden block'>
				<Image
					src={post.image || "/placeholder-blog.jpg"}
					alt={post.title}
					fill
					priority={index < 3}
					unoptimized
					className='object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				<div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

				<div className={cn("absolute top-4 z-10", isAr ? "right-4" : "left-4")}>
					<span className='bg-background/80 backdrop-blur-md text-foreground text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-tighter border border-border/50'>
						{post.categoryName}
					</span>
				</div>
			</Link>

			{/* Content Body */}
			<div className='flex flex-col grow p-6 md:p-8'>
				<div className='flex items-center gap-4 text-[11px] text-muted-foreground mb-4 font-medium uppercase tracking-wider'>
					<span className='flex items-center gap-1.5'>
						<Calendar size={14} className='text-primary' />
						{post.publishedAt
							? format(new Date(post.publishedAt), "dd MMM yyyy", {
									locale: dateLocale,
							  })
							: t("draft")}
					</span>
					<span className='w-1 h-1 rounded-full bg-border' />
					<span className='flex items-center gap-1.5'>
						<Clock size={14} className='text-primary' />
						{readTime} {t("readTime")}
					</span>
				</div>

				<h3
					className={cn(
						"text-xl md:text-2xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors",
						isAr && "font-sans leading-relaxed",
					)}>
					<Link href={`/${locale.toLowerCase()}/blogs/${post.id}`}>
						{post.title}
					</Link>
				</h3>

				<p
					className={cn(
						"text-muted-foreground line-clamp-3 mb-8 text-sm leading-relaxed",
						isAr && "text-base",
					)}>
					{post.excerpt}
				</p>

				{/* Footer Link */}
				<Link
					href={`/${locale.toLowerCase()}/blogs/${post.id}`}
					className='inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest group/link mt-auto transition-colors hover:text-primary'>
					<span className='relative'>
						{t("continueReading")}
						<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full' />
					</span>
					<ArrowRight
						size={16}
						className={cn(
							"transition-transform duration-300",
							isAr
								? "rotate-180 group-hover/link:-translate-x-2"
								: "group-hover/link:translate-x-2",
						)}
					/>
				</Link>
			</div>
		</MotionSection>
	);
}
