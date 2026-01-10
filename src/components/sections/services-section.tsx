/** @format */

"use client";

import { motion } from "framer-motion";
import {
	Check,
	Rocket,
	Microscope,
	LayoutDashboard,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const services = [
	{
		title: "Research-Driven App",
		description:
			"Perfect for AI, Security models, or data-intensive research projects.",
		price: "$1,500",
		icon: <Microscope className='w-6 h-6 text-blue-500' />,
		features: [
			"Algorithm Implementation",
			"Research Documentation",
			"Data Visualization",
			"API Integration",
		],
		cta: "Order Research App",
	},
	{
		title: "Custom SaaS Dashboard",
		description:
			"High-performance admin panels and multi-tenant management systems.",
		price: "$2,000",
		icon: <LayoutDashboard className='w-6 h-6 text-green-500' />,
		features: [
			"User Authentication",
			"Real-time Database",
			"Stripe Integration",
			"Clean Architecture",
		],
		cta: "Order Dashboard",
		popular: true,
	},
	{
		title: "Full-Stack MVP",
		description:
			"Get your product to market fast with a scalable and secure web application.",
		price: "$3,000",
		icon: <Rocket className='w-6 h-6 text-purple-500' />,
		features: [
			"UI/UX Design",
			"Custom Backend",
			"Cloud Deployment",
			"Maintenance Support",
		],
		cta: "Order Full Product",
	},
];

export const ServicesSection = () => {
	return (
		<section
			id='services'
			className='py-24 bg-muted/30 dark:bg-muted/10 transition-colors duration-500'>
			<div className='container mx-auto px-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='text-center mb-16 space-y-4'>
					<h2 className='text-4xl font-bold tracking-tight'>
						Available <span className='text-primary'>Services</span>
					</h2>
					<p className='text-muted-foreground max-w-2xl mx-auto text-lg'>
						Choose a service package tailored to your project's complexity.
					</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{services.map((service, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}>
							<Card
								className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl dark:hover:shadow-primary/5 border-muted-foreground/10 ${
									service.popular ? "border-primary ring-1 ring-primary/50" : ""
								}`}>
								{service.popular && (
									<span className='absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-3 py-1 rounded-full'>
										Most Popular
									</span>
								)}
								<CardHeader className='text-center'>
									<div className='mx-auto p-3 rounded-2xl bg-primary/5 w-fit mb-4'>
										{service.icon}
									</div>
									<CardTitle className='text-2xl'>{service.title}</CardTitle>
									<CardDescription className='min-h-[40px] mt-2'>
										{service.description}
									</CardDescription>
								</CardHeader>
								<CardContent className='flex-grow space-y-6'>
									<div className='text-center'>
										<span className='text-sm text-muted-foreground'>
											Starting from
										</span>
										<div className='text-3xl font-bold'>{service.price}</div>
									</div>
									<ul className='space-y-3'>
										{service.features.map((feature) => (
											<li
												key={feature}
												className='flex items-center gap-3 text-sm text-muted-foreground'>
												<Check className='w-4 h-4 text-primary shrink-0' />
												{feature}
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										className='w-full rounded-xl group'
										variant={service.popular ? "default" : "outline"}>
										{service.cta}
										<ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
