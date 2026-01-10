/** @format */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "../blog-card";
import { MotionSection } from "../shared/motion-viewport";
import { TransformedBlog } from "@/types/blog-types";
import { Locale } from "@prisma/client";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BlogSectionProps {
	blogs: TransformedBlog[];
	locale: Locale;
}

export default function BlogSection({ blogs, locale }: BlogSectionProps) {
	const t = useTranslations("BlogSection");
	const isAr = locale.toLowerCase() === "ar";

	return (
		<section
			className='py-24 relative overflow-hidden bg-background'
			dir={isAr ? "rtl" : "ltr"}>
			{/* Subtle background decorative element */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-border to-transparent' />

			<div className='container mx-auto px-6 max-w-7xl'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6'>
					<MotionSection
						preset={isAr ? "fadeInRight" : "fadeInLeft"}
						className='space-y-2'>
						<h2
							className={cn(
								"text-4xl md:text-6xl font-bold tracking-tighter leading-tight",
								isAr && "font-sans tracking-normal",
							)}>
							{t("titleStart")}{" "}
							<span className='text-primary italic font-serif'>
								{t("titleEnd")}
							</span>
						</h2>
						<div className='h-1.5 w-20 bg-primary rounded-full' />
					</MotionSection>

					<Link
						href={`/${locale.toLowerCase()}/blogs`}
						className='group inline-flex items-center  gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors'>
						{t("viewAll")}
						<ArrowRight
							size={18}
							className={cn(
								"transition-transform duration-300",
								isAr
									? "rotate-180 group-hover:-translate-x-2"
									: "group-hover:translate-x-2",
							)}
						/>
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12'>
					{blogs.map((post, i) => (
						<BlogCard key={post.id} post={post} locale={locale} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
