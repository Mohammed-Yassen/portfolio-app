/** @format */
"use client";

import React, { useTransition } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Newspaper,
	UserCheck,
	Mail,
	Sparkles,
	Briefcase,
} from "lucide-react";
import { updateSectionStatus } from "@/server/actions/setting";
import { Locale, SectionActive } from "@prisma/client";
import { SectionActiveValues } from "@/server/validations";

/**
 * Extract only the boolean toggle keys from the SectionActive model,
 * excluding metadata like 'id' and 'updatedAt'.
 */
type SectionKey = keyof Omit<SectionActive, "id" | "updatedAt">;

interface SectionActivationClientProps {
	config: SectionActive | null;
	locale: Locale;
}

export function SectionActivationClient({
	config,
	locale,
}: SectionActivationClientProps) {
	const [isPending, startTransition] = useTransition();

	// We cast the config to SectionActiveValues to ensure it aligns with our Zod schema
	const [optimisticConfig, setOptimisticConfig] =
		React.useState<SectionActiveValues>(config as never);

	const onToggle = async (field: SectionKey, currentValue: boolean) => {
		const nextValue = !currentValue;

		// Create the updated state object
		const updatedConfig: SectionActiveValues = {
			...optimisticConfig,
			[field]: nextValue,
		};

		// 1. Local Optimistic UI Update
		setOptimisticConfig(updatedConfig);

		startTransition(async () => {
			// Send the full validated object to the server
			const res = await updateSectionStatus(updatedConfig);

			if (res.error) {
				toast.error(res.error);
				// Rollback to initial server config on failure
				setOptimisticConfig(config as never);
			} else {
				const sectionName = field.replace("Active", "");
				toast.success(
					`${
						sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
					} updated`,
				);
			}
		});
	};
	return (
		<div className='animate-in fade-in duration-500 space-y-10'>
			<div className='flex flex-col gap-1'>
				<h2 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2'>
					<Sparkles className='text-indigo-500 w-5 h-5' />
					Section Management
				</h2>
				<p className='text-zinc-500 dark:text-zinc-400 text-sm'>
					Toggle visibility for each portfolio module in real-time.
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
				{/* Global Components */}
				<ActivationGroup
					title='Layout & Foundation'
					icon={<LayoutDashboard className='w-5 h-5 text-blue-500' />}
					description='Control navigation and essential site-wide containers'>
					<ToggleItem
						label='Navbar Visibility'
						field='navActive'
						value={optimisticConfig?.navActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Footer Visibility'
						field='footerActive'
						value={optimisticConfig?.footerActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Hero Section'
						field='heroActive'
						value={optimisticConfig?.heroActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
				</ActivationGroup>

				{/* Identity & Bio */}
				<ActivationGroup
					title='Identity & Experience'
					icon={<UserCheck className='w-5 h-5 text-emerald-500' />}
					description='Personal background and professional timeline'>
					<ToggleItem
						label='About Section'
						field='aboutActive'
						value={optimisticConfig?.aboutActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Professional Skills'
						field='skillActive'
						value={optimisticConfig?.skillActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Work Experience'
						field='experienceActive'
						value={optimisticConfig?.experienceActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
				</ActivationGroup>

				{/* Portfolio Showcase */}
				<ActivationGroup
					title='Work Showcase'
					icon={<Briefcase className='w-5 h-5 text-indigo-500' />}
					description='Your projects and professional services'>
					<ToggleItem
						label='Projects Gallery'
						field='projectActive'
						value={optimisticConfig?.projectActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Service Offerings'
						field='serviceActive'
						value={optimisticConfig?.serviceActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Insights / Blog'
						field='blogActive'
						value={optimisticConfig?.blogActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
				</ActivationGroup>

				{/* Engagement */}
				<ActivationGroup
					title='Social Proof & Reach'
					icon={<Mail className='w-5 h-5 text-orange-500' />}
					description='Engagement channels and client testimonials'>
					<ToggleItem
						label='Testimonials'
						field='testiActive'
						value={optimisticConfig?.testiActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
					<ToggleItem
						label='Contact Section'
						field='contactActive'
						value={optimisticConfig?.contactActive}
						onToggle={onToggle}
						disabled={isPending}
					/>
				</ActivationGroup>
			</div>
		</div>
	);
}

/**
 * Shared layout for a group of toggle switches
 */
interface GroupProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function ActivationGroup({ title, description, icon, children }: GroupProps) {
	return (
		<Card className='group overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300'>
			<CardHeader className='border-b border-zinc-100 dark:border-zinc-800/50 pb-4'>
				<div className='flex items-center gap-4'>
					<div className='p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 transition-transform duration-300'>
						{icon}
					</div>
					<div className='space-y-0.5'>
						<CardTitle className='text-base font-bold tracking-tight'>
							{title}
						</CardTitle>
						<CardDescription className='text-[12px] leading-tight'>
							{description}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className='pt-4 px-3 sm:px-6 space-y-1.5 pb-6'>
				{children}
			</CardContent>
		</Card>
	);
}

/**
 * Individual toggle item with Label and Switch
 */
interface ToggleItemProps {
	label: string;
	field: SectionKey;
	value: boolean;
	onToggle: (field: SectionKey, value: boolean) => void;
	disabled: boolean;
}

function ToggleItem({
	label,
	field,
	value,
	onToggle,
	disabled,
}: ToggleItemProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 border",
				value
					? "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10"
					: "bg-transparent border-transparent opacity-60 hover:opacity-100",
				disabled && "pointer-events-none grayscale opacity-40",
			)}>
			<Label
				htmlFor={field}
				className='cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex-1 py-1'>
				{label}
			</Label>
			<Switch
				id={field}
				checked={value}
				onCheckedChange={() => onToggle(field, value)}
				className='data-[state=checked]:bg-indigo-600'
			/>
		</div>
	);
}
