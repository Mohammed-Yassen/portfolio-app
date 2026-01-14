/** @format */

"use client";

import Link from "next/link";
import {
	Github,
	Linkedin,
	Mail,
	ArrowUpRight,
	ChevronUp,
	Twitter,
	ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MotionSection } from "../shared/motion-viewport";
import { SocialLinks, Locale } from "@prisma/client";

interface FooterProps {
	socialLinks: SocialLinks[] | null;
	locale: Locale;
}

export const Footer = ({ socialLinks, locale }: FooterProps) => {
	const t = useTranslations("Footer");
	const h = useTranslations("Hero"); // Reusing Hero translations for consistency
	const currentYear = new Date().getFullYear();
	const isRtl = locale === "ar";

	// Dynamic Social Mapping
	const githubUrl = socialLinks?.find(
		(s) => s.name.toLowerCase() === "github",
	)?.url;
	const linkedinUrl = socialLinks?.find(
		(s) => s.name.toLowerCase() === "linkedin",
	)?.url;
	const emailUrl = socialLinks?.find(
		(s) => s.name.toLowerCase() === "email",
	)?.url;

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer
			dir={isRtl ? "rtl" : "ltr"}
			className='relative border-t border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 pt-24 pb-12 overflow-hidden'>
			{/* Background Glow - Matching Hero Style */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent' />
			<div className='absolute -bottom-24 left-1/2 -translate-x-1/2 w-150 h-75 bg-indigo-500/10 blur-[120px] rounded-full -z-10' />

			<div className='container mx-auto px-6 max-w-7xl relative z-10'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20'>
					{/* Brand Section - 4 Cols */}
					<div className='lg:col-span-5 space-y-8'>
						<Link
							href='/'
							className='text-2xl font-black tracking-tighter text-zinc-900 dark:text-white group flex items-center gap-2'>
							<div className='w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white scale-90 group-hover:rotate-12 transition-transform'>
								P
							</div>
							PORTFOLIO<span className='text-indigo-500'>.</span>
						</Link>

						<p className='text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-sm'>
							{t("description") ||
								"Crafting high-performance digital experiences with a focus on modern architecture and user-centric design."}
						</p>

						<div className='flex items-center gap-3'>
							<SocialButton
								href={githubUrl}
								icon={<Github size={18} />}
								label='GitHub'
							/>
							<SocialButton
								href={linkedinUrl}
								icon={<Linkedin size={18} />}
								label='LinkedIn'
							/>
							<SocialButton
								href={
									emailUrl ? `mailto:${emailUrl}` : "mailto:hello@example.com"
								}
								icon={<Mail size={18} />}
								label='Email'
							/>
						</div>
					</div>

					{/* Navigation - 3 Cols */}
					<div className='lg:col-span-3 space-y-6'>
						<h4 className='text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100'>
							{t("nav_title") || "Navigation"}
						</h4>
						<ul className='grid grid-cols-1 gap-4'>
							<FooterLink href='/'>{t("home") || "Home"}</FooterLink>
							<FooterLink href='/projects'>
								{t("projects") || "Projects"}
							</FooterLink>
							<FooterLink href='/blogs'>{t("blog") || "Blog"}</FooterLink>

							<FooterLink href='#about'>{t("about") || "About"}</FooterLink>
						</ul>
					</div>

					{/* Newsletter/Contact - 4 Cols */}
					<div className='lg:col-span-4 space-y-6'>
						<h4 className='text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100'>
							{t("newsletter_title") || "Drop a message"}
						</h4>
						<div className='p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 space-y-4'>
							<p className='text-sm text-zinc-500 dark:text-zinc-400'>
								{t("newsletter_desc") ||
									"Interested in working together? Let's build something great."}
							</p>
							<Link
								href={emailUrl ? `mailto:${emailUrl}` : "#"}
								className='flex items-center justify-center gap-2 w-full py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all group'>
								{h("talk_button")}
								<ArrowUpRight
									size={16}
									className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'
								/>
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-8 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[11px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500'>
						<span>© {currentYear} — ALL RIGHTS RESERVED</span>
						<div className='hidden md:block h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-800' />
						<Link
							href='/privacy'
							className='hover:text-indigo-500 transition-colors'>
							PRIVACY POLICY
						</Link>
					</div>

					{/* Back to Top */}
					<button
						onClick={scrollToTop}
						className='group flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>
						BACK TO TOP
						<div className='w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors'>
							<ChevronUp
								size={16}
								className='group-hover:-translate-y-0.5 transition-transform'
							/>
						</div>
					</button>
				</div>
			</div>
		</footer>
	);
};

// --- Sub-components for cleaner code ---

const SocialButton = ({
	href,
	icon,
	label,
}: {
	href?: string;
	icon: React.ReactNode;
	label: string;
}) => (
	<a
		href={href || "#"}
		target='_blank'
		rel='noopener noreferrer'
		className='w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white dark:hover:text-white transition-all duration-300'
		aria-label={label}>
		{icon}
	</a>
);

const FooterLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => (
	<li>
		<Link
			href={href}
			className='text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium flex items-center group w-fit'>
			<span className='w-0 group-hover:w-2 h-px bg-indigo-500 mr-0 group-hover:mr-2 transition-all duration-300' />
			{children}
		</Link>
	</li>
);
