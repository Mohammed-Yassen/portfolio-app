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
import { MotionViewport } from "../motion-viewport";
import { Certification } from "@prisma/client";

interface CertificationsSectionProps {
	certifications: Certification[];
}

// Helper to pick icons based on title keywords
const getIcon = (title: string) => {
	const t = title.toLowerCase();
	if (t.includes("security") || t.includes("lock"))
		return <Lock className='text-yellow-500' size={40} />;
	if (t.includes("cloud") || t.includes("aws") || t.includes("azure"))
		return <Zap className='text-yellow-500' size={40} />;
	if (t.includes("google") || t.includes("shield"))
		return <ShieldCheck className='text-yellow-500' size={40} />;
	if (t.includes("scrum") || t.includes("agile"))
		return <Award className='text-yellow-500' size={40} />;
	return <Medal className='text-yellow-500' size={40} />;
};

export const CertificationsSection = ({
	certifications,
}: CertificationsSectionProps) => {
	return (
		<section
			id='certifications'
			className='py-24 bg-background relative overflow-hidden'>
			{/* Decorative Background Glow */}
			<div className='absolute top-0 right-0 w-125 h-125 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none' />

			<div className='container mx-auto px-6 max-w-7xl'>
				<div className='text-center mb-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}>
						<h2 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-800'>
							Professional Credentials
						</h2>
						<p className='text-muted-foreground mt-4 text-lg'>
							Industry-recognized certifications and verified expertise
						</p>
					</motion.div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{certifications.map((cert, i) => (
						<MotionViewport
							key={cert.id}
							delay={i * 0.1}
							preset='fadeInUp'
							className='group perspective-1000'>
							<motion.div
								whileHover={{
									rotateY: 5,
									rotateX: -5,
									scale: 1.02,
									y: -5,
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className='relative h-full bg-zinc-950 border border-yellow-600/20 p-8 rounded-3xl shadow-xl flex flex-col items-start transition-all duration-300 group-hover:border-yellow-600/50 group-hover:bg-zinc-900/40 group-hover:shadow-yellow-500/5'>
								{/* Background Decorative Icon */}
								<div className='absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none'>
									<Award size={100} />
								</div>

								{/* Header: Icon & Verified Tag */}
								<div className='w-full flex justify-between items-start mb-6'>
									<div className='p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20'>
										{cert.imageUrl ? (
											<img
												src={cert.imageUrl}
												alt={cert.title}
												className='w-10 h-10 object-contain'
											/>
										) : (
											getIcon(cert.title)
										)}
									</div>
									<span className='text-[10px] uppercase tracking-[0.2em] text-yellow-600 font-bold px-3 py-1 bg-yellow-600/5 rounded-full border border-yellow-600/10'>
										Verified
									</span>
								</div>

								{/* Content */}
								<div className='grow'>
									<h3 className='text-2xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors'>
										{cert.title}
									</h3>
									<p className='text-zinc-400 text-sm font-medium mb-1'>
										{cert.issuer}
									</p>
									<p className='text-yellow-600/60 text-xs font-mono mb-6'>
										{cert.issueDate}
									</p>
								</div>

								{/* Footer: Credential ID & Link */}
								<div className='w-full pt-6 border-t border-white/5 mt-auto flex justify-between items-center'>
									<div>
										<p className='text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1'>
											Credential ID
										</p>
										<p className='text-xs text-zinc-300 font-mono'>
											{cert.credentialId || "N/A"}
										</p>
									</div>

									{cert.link && (
										<motion.a
											href={cert.link}
											target='_blank'
											rel='noopener noreferrer'
											whileTap={{ scale: 0.9 }}
											className='p-3 bg-yellow-600 text-black rounded-xl transition-all shadow-[0_0_15px_rgba(202,138,4,0.3)] hover:bg-yellow-400'>
											<ExternalLink size={16} />
										</motion.a>
									)}
								</div>
							</motion.div>
						</MotionViewport>
					))}
				</div>
			</div>
		</section>
	);
}; // /** @format */
// "use client";

// import { motion } from "framer-motion";
// import { ExternalLink, Award, ShieldCheck, Zap, Lock } from "lucide-react";
// import { MotionViewport } from "../motion-viewport";

// const certs = [
//     {
//         name: "AWS Solutions Architect",
//         issuer: "Amazon Web Services",
//         date: "Dec 2024",
//         id: "AWS-7782-9910",
//         skills: ["Cloud", "Security", "Scalability"],
//         icon: <Zap className="text-yellow-500" size={40} />,
//     },
//     {
//         name: "Offensive Security (OSCP)",
//         issuer: "OffSec",
//         date: "Jan 2024",
//         id: "OS-102-4451",
//         skills: ["Pentesting", "Linux", "Exploitation"],
//         icon: <Lock className="text-yellow-500" size={40} />,
//     },
//     {
//         name: "Professional Scrum Master",
//         issuer: "Scrum.org",
//         date: "Mar 2024",
//         id: "PSM-I-9920",
//         skills: ["Agile", "Leadership", "Planning"],
//         icon: <Award className="text-yellow-500" size={40} />,
//     },
//     {
//         name: "Google Cloud Engineer",
//         issuer: "Google Cloud",
//         date: "Nov 2024",
//         id: "GCP-5512-0091",
//         skills: ["DevOps", "Kubernetes", "Data"],
//         icon: <ShieldCheck className="text-yellow-500" size={40} />,
//     },
// ];

// export const CertificationsSection = () => (
//     <section className='py-24 bg-background relative overflow-hidden'>
//         {/* Decorative Background Glow */}
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

//         <div className='container mx-auto px-6 max-w-7xl'>
//             <div className='text-center mb-16'>
//                 <h2 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-800'>
//                     Professional Credentials
//                 </h2>
//                 <p className='text-muted-foreground mt-4 text-lg'>
//                     Industry-recognized certifications and verified expertise
//                 </p>
//             </div>

//             {/* Grid: 1 col on mobile, 2 col on tablet, 4 col on large screens for equal size */}
//             <div className='grid grid-cols-1 md:grid-cols-2   gap-12'>
//                 {certs.map((cert, i) => (
//                     <MotionViewport
//                         key={i}
//                         delay={i * 0.1}
//                         preset="fadeInUp"
//                         className='group perspective-1000'
//                     >
//                         <motion.div
//                             whileHover={{
//                                 rotateY: 5,
//                                 rotateX: -5,
//                                 scale: 1.02,
//                                 y: -5
//                             }}
//                             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                             className='relative h-full bg-zinc-950 border border-yellow-600/20 p-6 rounded-2xl shadow-xl flex flex-col items-start transition-colors group-hover:border-yellow-600/50 group-hover:bg-zinc-900/50'
//                         >
//                             {/* Certificate Decoration */}
//                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
//                                 <Award size={80} />
//                             </div>

//                             <div className="mb-4 p-3 bg-yellow-500/10 rounded-xl">
//                                 {cert.icon}
//                             </div>

//                             <span className='text-[10px] uppercase tracking-[0.2em] text-yellow-600 font-bold mb-2'>
//                                 Verified Professional
//                             </span>

//                             <h3 className='text-xl font-bold text-white mb-2 leading-tight min-h-[56px]'>
//                                 {cert.name}
//                             </h3>

//                             <p className='text-zinc-400 text-sm font-medium mb-4'>{cert.issuer}</p>

//                             <div className='flex flex-wrap gap-1.5 mb-8'>
//                                 {cert.skills.map((s) => (
//                                     <span
//                                         key={s}
//                                         className='px-2 py-0.5 bg-yellow-600/5 border border-yellow-600/10 text-yellow-500/80 text-[10px] rounded-md'>
//                                         {s}
//                                     </span>
//                                 ))}
//                             </div>

//                             {/* Footer Section - Pushed to Bottom */}
//                             <div className='w-full pt-4 border-t border-white/5 mt-auto flex justify-between items-center'>
//                                 <div className='text-[10px]'>
//                                     <p className='text-zinc-500 uppercase font-bold tracking-tighter'>Credential ID</p>
//                                     <p className='text-zinc-300 font-mono'>{cert.id}</p>
//                                 </div>
//                                 <motion.button
//                                     whileTap={{ scale: 0.9 }}
//                                     className='p-2 bg-yellow-600/90 hover:bg-yellow-500 text-black rounded-lg transition-all shadow-[0_0_15px_rgba(202,138,4,0.2)] hover:shadow-[0_0_20px_rgba(202,138,4,0.4)]'
//                                 >
//                                     <ExternalLink size={14} />
//                                 </motion.button>
//                             </div>
//                         </motion.div>
//                     </MotionViewport>
//                 ))}
//             </div>
//         </div>
//     </section>
// );
