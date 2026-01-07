/** @format */

"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionSection } from "../shared/motion-viewport";

const footerLinks = [
	{
		title: "Navigation",
		links: [
			{ name: "Home", href: "/" },
			{ name: "Projects", href: "/projects" },
			{ name: "About", href: "/about" },
			{ name: "Blog", href: "/blog" },
		],
	},
	{
		title: "Services",
		links: [
			{ name: "Web Development", href: "#" },
			{ name: "UI/UX Design", href: "#" },
			{ name: "Consultation", href: "#" },
		],
	},
];

const socials = [
	{ icon: Github, href: "https://github.com", label: "GitHub" },
	{ icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
	{ icon: Twitter, href: "https://twitter.com", label: "Twitter" },
	{ icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='relative border-t border-border bg-background pt-20 pb-10 overflow-hidden'>
			{/* Background Decorative Element */}
			<div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[120px] rounded-full -z-10' />

			<div className='container mx-auto px-6 max-w-7xl'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
					{/* Column 1: Brand/Logo */}
					<MotionSection as='div' preset='fadeInUp' className='space-y-6'>
						<Link
							href='/'
							className='text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity'>
							DEV<span className='text-primary'>.PORTFOLIO</span>
						</Link>
						<p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
							Building digital experiences with focus on performance, security,
							and high-quality user interfaces.
						</p>
						<div className='flex items-center gap-4'>
							{socials.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target='_blank'
									rel='noopener noreferrer'
									className='p-2 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20'
									aria-label={social.label}>
									<social.icon size={20} />
								</a>
							))}
						</div>
					</MotionSection>

					{/* Dynamic Link Columns */}
					{footerLinks.map((column, idx) => (
						<MotionSection
							as='div'
							key={column.title}
							delay={0.1 * idx}
							preset='fadeInUp'
							className='space-y-6'>
							<h4 className='text-sm font-bold uppercase tracking-widest text-foreground'>
								{column.title}
							</h4>
							<ul className='space-y-4'>
								{column.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className='text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group'>
											{link.name}
											<ArrowUpRight
												size={14}
												className='opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all ml-1'
											/>
										</Link>
									</li>
								))}
							</ul>
						</MotionSection>
					))}

					{/* Column 4: Newsletter/CTA */}
					<MotionSection
						as='div'
						delay={0.3}
						preset='fadeInUp'
						className='space-y-6'>
						<h4 className='text-sm font-bold uppercase tracking-widest text-foreground'>
							Stay Connected
						</h4>
						<p className='text-muted-foreground text-sm'>
							Subscribe to my newsletter for the latest tech updates.
						</p>
						<form
							className='relative group'
							onSubmit={(e) => e.preventDefault()}>
							<input
								type='email'
								placeholder='Email Address'
								className='w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
							/>
							<button className='absolute right-2 top-2 bottom-2 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:brightness-110 transition-all'>
								Join
							</button>
						</form>
					</MotionSection>
				</div>

				{/* Bottom Bar */}
				<MotionSection
					as='div'
					preset='fadeInUp'
					delay={0.4}
					className='pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6'>
					<p className='text-muted-foreground text-xs text-center md:text-left'>
						© {currentYear} Developer Portfolio. All rights reserved.
					</p>
					<div className='flex gap-8'>
						<Link
							href='/privacy'
							className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
							Privacy Policy
						</Link>
						<Link
							href='/terms'
							className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
							Terms of Service
						</Link>
					</div>
				</MotionSection>
			</div>
		</footer>
	);
};
