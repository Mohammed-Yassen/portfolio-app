/** @format */
"use client";

import { motion } from "framer-motion";
import {
	ExternalLink,
	Award,
	ShieldCheck,
	Zap,
	Lock,
	Medal,
} from "lucide-react";
import { Locale } from "@prisma/client";
import { MotionSection } from "../shared/motion-viewport";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// Assuming you have a type that includes the translation for the current locale
import { TransformedCertification } from "@/types";

interface Props {
	certifications: TransformedCertification[] | null;
	locale: Locale;
}

const getIcon = (issuer: string) => {
	const t = issuer.toLowerCase();
	if (t.includes("security") || t.includes("offsec"))
		return <Lock className='text-yellow-500' size={32} />;
	if (t.includes("cloud") || t.includes("aws") || t.includes("azure"))
		return <Zap className='text-yellow-500' size={32} />;
	if (t.includes("google") || t.includes("shield"))
		return <ShieldCheck className='text-yellow-500' size={32} />;
	if (t.includes("scrum") || t.includes("agile"))
		return <Award className='text-yellow-500' size={32} />;
	return <Medal className='text-yellow-500' size={32} />;
};

export const CertificationsSection = ({ certifications, locale }: Props) => {
	const t = useTranslations("CertificationsSection");
	const isAr = locale === "ar";

	return (
		<section
			id='certifications'
			className='py-24 bg-background relative overflow-hidden transition-colors duration-500'>
			{/* Adaptive Glow */}
			<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 dark:bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none' />

			<div className='container mx-auto px-6 max-w-7xl relative z-10'>
				<div className='text-center mb-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}>
						<h2 className='text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-800 dark:from-yellow-200 dark:via-yellow-500 dark:to-yellow-800 uppercase tracking-tight'>
							{t("title")}
						</h2>
						<p className='text-muted-foreground mt-4 text-lg max-w-2xl mx-auto'>
							{t("subtitle")}
						</p>
					</motion.div>
				</div>

				<div
					className={cn(
						"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
						isAr ? "rtl" : "ltr",
					)}>
					{certifications?.map((cert, i) => (
						<MotionSection
							key={cert.id}
							delay={i * 0.1}
							preset='fadeInUp'
							className='group perspective-1000'>
							<motion.div
								whileHover={{ y: -8, rotateX: 2 }}
								className='relative h-full flex flex-col bg-slate-50/50 dark:bg-zinc-950 border border-slate-200 dark:border-yellow-600/20 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:border-yellow-500/50 dark:hover:bg-zinc-900/40'>
								{/* Background Decorative Watermark */}
								<div
									className={cn(
										"absolute top-4 opacity-[0.03] dark:opacity-[0.05] transition-opacity pointer-events-none",
										isAr ? "left-4" : "right-4",
									)}>
									<Award size={120} />
								</div>

								<div className='flex justify-between items-start mb-8'>
									<div className='p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-inner'>
										{cert.coverUrl ? (
											<Image
												src={cert.coverUrl}
												alt={cert.issuer}
												className='w-10 h-10 object-contain'
												width={40}
												height={40}
											/>
										) : (
											getIcon(cert.issuer)
										)}
									</div>
									<div className='flex flex-col items-end gap-2'>
										<span className='text-[9px] uppercase tracking-[0.2em] text-yellow-600 font-black px-3 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20'>
											{t("verified")}
										</span>
									</div>
								</div>

								<div className='grow'>
									<h3 className='text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors'>
										{cert.title}
									</h3>
									<p className='text-muted-foreground text-sm font-semibold mb-1'>
										{cert.issuer}
									</p>
									<p className='text-yellow-600/70 dark:text-yellow-500/40 text-xs font-mono font-bold'>
										{new Date(cert.issueDate).toLocaleDateString(locale, {
											year: "numeric",
											month: "long",
										})}
									</p>

									{cert.description && (
										<p className='mt-4 text-sm text-muted-foreground/80 leading-relaxed line-clamp-3 border-t border-slate-200 dark:border-white/5 pt-4'>
											{cert.description}
										</p>
									)}
								</div>

								<div className='w-full pt-6 mt-8 border-t border-slate-200 dark:border-white/5 flex justify-between items-end'>
									<div>
										<p className='text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1'>
											{t("credentialId")}
										</p>
										<p className='text-xs text-foreground font-mono bg-slate-100 dark:bg-white/5 px-2 py-1 rounded'>
											{cert.credentialId || "N/A"}
										</p>
									</div>

									{cert.link && (
										<motion.a
											href={cert.link}
											target='_blank'
											rel='noopener noreferrer'
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className='p-3 bg-yellow-600 text-white dark:text-black rounded-xl shadow-lg shadow-yellow-600/20 hover:bg-yellow-500 transition-colors'>
											<ExternalLink size={18} />
										</motion.a>
									)}
								</div>
							</motion.div>
						</MotionSection>
					))}
				</div>
			</div>
		</section>
	);
};
