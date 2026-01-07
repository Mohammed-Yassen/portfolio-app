/** @format */
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

import {MotionSection} from "./shared/motion-viewport";

export function BlogCard({ post, index = 0 }: BlogCardProps) {
	const readTime = Math.ceil(post.content.length / 1000) || 1;

	return (
		<MotionSection
			preset='fadeInUp'
			delay={index * 0.1}
			className='group flex flex-col h-full'>
			<Link
				href={`/blogs/${post.id}`}
				className='relative aspect-[16/10] mb-6 overflow-hidden rounded-2xl block border bg-muted shadow-sm'>
				<img
					src={post.image || "/placeholder-blog.jpg"}
					alt={post.title}
					className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
				/>
				<div className='absolute top-4 left-4'>
					<span className='bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-white/10 shadow-xl'>
						{post.category}
					</span>
				</div>
			</Link>

			<div className='flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono'>
				<span className='flex items-center gap-1.5'>
					<Calendar size={14} className='text-primary/70' />
					{post.publishedAt
						? format(new Date(post.publishedAt), "MMM dd, yyyy")
						: "Draft"}
				</span>
				<span className='flex items-center gap-1.5'>
					<Clock size={14} className='text-primary/70' />
					{readTime} min read
				</span>
			</div>

			<div className='flex flex-col grow'>
				<h2 className='text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2'>
					<Link href={`/blogs/${post.id}`}>{post.title}</Link>
				</h2>
				<p className='text-muted-foreground line-clamp-3 mb-6 text-sm leading-relaxed'>
					{post.excerpt}
				</p>
			</div>

			<Link
				href={`/blogs/${post.id}`}
				className='inline-flex items-center gap-2 font-bold text-sm group/link hover:text-primary mt-auto'>
				Continue Reading
				<ArrowRight
					size={16}
					className='group-hover/link:translate-x-1 transition-transform text-primary'
				/>
			</Link>
		</MotionSection>
	);
}
