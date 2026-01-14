/** @format */
"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Testimonial } from "@prisma/client";
import {
	Star,
	Trash2,
	MoreHorizontal,
	ShieldCheck,
	ShieldAlert,
	Eye,
	Quote,
	Github,
	ExternalLink,
	Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	updateTestimonialStatus,
	deleteTestimonial,
} from "@/server/actions/testimonial";
interface TestimonialTableProps {
	data: Testimonial[];
	locale: string;
}

type ActionType = "status" | "feature" | "delete";

interface ActionPayload {
	field: "isActive" | "isFeatured";
	currentVal: boolean;
}

export function TestimonialTable({ data, locale }: TestimonialTableProps) {
	const t = useTranslations("AdminTestimonials");
	const [isPending, startTransition] = useTransition();
	const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null);

	const handleAction = (
		id: string,
		action: ActionType,
		payload?: ActionPayload,
	) => {
		// Confirmation for delete
		if (action === "delete" && !confirm(t("confirmDelete"))) return;

		startTransition(async () => {
			let result;

			if (action === "delete") {
				// Pass as object: { id: "..." }
				result = await deleteTestimonial({ id });
			} else if (payload) {
				// Pass everything in one object to match the Zod schema
				result = await updateTestimonialStatus({
					id,
					[payload.field]: !payload.currentVal,
				});
			}

			if (result?.success) {
				toast.success(t("actionSuccess"));
			} else {
				toast.error(result?.error || t("actionError"));
			}
		});
	};

	const isRtl = locale === "ar";
	return (
		<div className='w-full overflow-auto border rounded-lg'>
			<Table>
				<TableHeader className='bg-zinc-50/50 dark:bg-zinc-900/50'>
					<TableRow>
						<TableHead className='w-62.5 text-start'>
							{t("colClient")}
						</TableHead>
						<TableHead className='text-start'>{t("colStatus")}</TableHead>
						<TableHead className='text-start'>{t("colRating")}</TableHead>
						<TableHead className='text-end'>{t("colActions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 ? (
						<EmptyState colSpan={4} message={t("noData")} />
					) : (
						data.map((item) => (
							<TestimonialRow
								key={item.id}
								item={item}
								isRtl={isRtl}
								isPending={isPending}
								onViewDetails={() => setSelectedItem(item)}
								onAction={handleAction}
								t={t}
							/>
						))
					)}
				</TableBody>
			</Table>

			<TestimonialDetailModal
				selectedItem={selectedItem}
				onClose={() => setSelectedItem(null)}
				t={t}
				isRtl={isRtl}
				locale={locale}
			/>
		</div>
	);
}

/** * Sub-components for better readability
 */

const EmptyState = ({
	colSpan,
	message,
}: {
	colSpan: number;
	message: string;
}) => (
	<TableRow>
		<TableCell
			colSpan={colSpan}
			className='h-32 text-center text-muted-foreground'>
			{message}
		</TableCell>
	</TableRow>
);

interface TestimonialRowProps {
	item: Testimonial;
	isRtl: boolean;
	isPending: boolean;
	onViewDetails: () => void;
	onAction: (id: string, action: ActionType, payload?: ActionPayload) => void;
	t: (key: string) => string;
}

const TestimonialRow = ({
	item,
	isRtl,
	isPending,
	onViewDetails,
	onAction,
	t,
}: TestimonialRowProps) => (
	<TableRow className='group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'>
		<TableCell className='text-start'>
			<div className='flex items-center gap-3'>
				<Avatar className='h-9 w-9 border border-zinc-200 dark:border-zinc-800'>
					<AvatarImage src={item.avatarUrl ?? ""} />
					<AvatarFallback className='text-[10px] font-bold'>
						{item.clientName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col min-w-0'>
					<span className='font-semibold text-sm truncate'>
						{item.clientName}
					</span>
					<span className='text-xs text-muted-foreground truncate opacity-70'>
						{item.clientTitle || "Customer"}
					</span>
				</div>
			</div>
		</TableCell>

		<TableCell className='text-start'>
			<div className='flex items-center gap-2'>
				<Badge
					variant='outline'
					className={cn(
						"px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
						item.isActive
							? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
							: "bg-zinc-100 text-zinc-500 border-zinc-200",
					)}>
					{item.isActive ? t("statusLive") : t("statusPending")}
				</Badge>
				{item.isFeatured && (
					<Star className='h-3 w-3 fill-amber-500 text-amber-500' />
				)}
			</div>
		</TableCell>

		<TableCell className='text-start'>
			<div className='flex items-center gap-0.5'>
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={cn(
							"h-3 w-3",
							i < (item.rating || 0)
								? "fill-amber-400 text-amber-400"
								: "text-zinc-200 dark:text-zinc-800",
						)}
					/>
				))}
			</div>
		</TableCell>

		<TableCell className='text-end'>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon' className='h-8 w-8 rounded-full'>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align={isRtl ? "start" : "end"}
					className='w-52 p-2'>
					<DropdownMenuLabel className='text-[10px] uppercase text-muted-foreground'>
						{t("quickActions")}
					</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={onViewDetails}
						className='rounded-lg gap-2 cursor-pointer'>
						<Eye className='h-4 w-4' /> {t("viewDetails")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={isPending}
						onClick={() =>
							onAction(item.id, "status", {
								field: "isActive",
								currentVal: item.isActive,
							})
						}
						className='rounded-lg gap-2 cursor-pointer'>
						{item.isActive ? (
							<>
								<ShieldAlert className='h-4 w-4 text-amber-500' />{" "}
								{t("unapprove")}
							</>
						) : (
							<>
								<ShieldCheck className='h-4 w-4 text-emerald-500' />{" "}
								{t("approve")}
							</>
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={isPending}
						onClick={() =>
							onAction(item.id, "feature", {
								field: "isFeatured",
								currentVal: item.isFeatured,
							})
						}
						className='rounded-lg gap-2 cursor-pointer'>
						<Star
							className={cn(
								"h-4 w-4",
								item.isFeatured && "fill-amber-500 text-amber-500",
							)}
						/>
						{item.isFeatured ? t("unfeature") : t("feature")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={isPending}
						onClick={() => onAction(item.id, "delete")}
						className='rounded-lg gap-2 text-destructive focus:bg-destructive/10 cursor-pointer'>
						<Trash2 className='h-4 w-4' /> {t("delete")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</TableCell>
	</TableRow>
);

interface TestimonialDetailModalProps {
	selectedItem: Testimonial | null;
	onClose: () => void;
	t: (key: string) => string;
	isRtl: boolean;
	locale: string;
}

export const TestimonialDetailModal = ({
	selectedItem,
	onClose,
	t,
	isRtl,
	locale,
}: TestimonialDetailModalProps) => {
	if (!selectedItem) return null;

	return (
		<Dialog open={!!selectedItem} onOpenChange={onClose}>
			<DialogContent
				className='sm:max-w-2xl overflow-hidden p-0 gap-0'
				dir={isRtl ? "rtl" : "ltr"}>
				<div className='h-2 bg-primary w-full' />
				<div className='p-6'>
					<DialogHeader
						className={cn("space-y-4", isRtl ? "text-right" : "text-left")}>
						<div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
							<div className='space-y-1'>
								<DialogTitle className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
									<Quote
										className={cn(
											"h-6 w-6 text-primary/40",
											isRtl && "scale-x-[-1]",
										)}
									/>
									{t("testimonialDetail")}
								</DialogTitle>
								<DialogDescription className='text-zinc-500'>
									{t("submittedOn")}{" "}
									{new Date(selectedItem.createdAt).toLocaleDateString(locale, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</DialogDescription>
							</div>
							<div className='flex gap-2 shrink-0'>
								{selectedItem.isFeatured && (
									<Badge
										variant='outline'
										className='bg-amber-500/10 text-amber-600 border-amber-200 gap-1 px-3 py-1'>
										<Star className='h-3.5 w-3.5 fill-amber-600' />{" "}
										{t("featured")}
									</Badge>
								)}
								<Badge
									className={cn(
										"px-3 py-1",
										selectedItem.isActive
											? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
											: "bg-zinc-100 text-zinc-600 border-zinc-200",
									)}
									variant='outline'>
									{selectedItem.isActive ? t("statusLive") : t("statusPending")}
								</Badge>
							</div>
						</div>
					</DialogHeader>

					<div className='mt-6 relative'>
						<div className='p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden'>
							<Quote
								className={cn(
									"absolute -top-4 -right-4 h-24 w-24 text-zinc-200/50 dark:text-zinc-800/50 -rotate-12",
									isRtl && "left-4 right-auto scale-x-[-1]",
								)}
							/>
							<div className='relative z-10'>
								<div className='flex flex-col text-sm mb-4'>
									<span className='text-primary font-semibold tracking-wide uppercase text-xs'>
										{selectedItem.clientTitle || "Contributor"}
									</span>
									<span className='text-primary font-semibold tracking-wide uppercase text-xs'>
										{selectedItem.role || "role"}
									</span>
								</div>
								<p className='text-zinc-800 dark:text-zinc-200 leading-relaxed italic text-xl font-medium'>
									&quot;{selectedItem.content}&quot;
								</p>
							</div>
						</div>
					</div>

					<div className='mt-6 flex flex-wrap gap-3'>
						{selectedItem.githubUrl && (
							<Button
								variant='secondary'
								size='sm'
								asChild
								className='rounded-xl gap-2'>
								<a
									href={selectedItem.githubUrl}
									target='_blank'
									rel='noopener noreferrer'>
									<Github className='h-4 w-4' /> {t("viewRepo")}
								</a>
							</Button>
						)}
						{selectedItem.linkedinUrl && (
							<Button
								variant='secondary'
								size='sm'
								asChild
								className='rounded-xl gap-2'>
								<a
									href={selectedItem.linkedinUrl}
									target='_blank'
									rel='noopener noreferrer'>
									<ExternalLink className='h-4 w-4' /> {t("viewProject")}
								</a>
							</Button>
						)}
					</div>

					<div className='mt-8 flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-transparent border rounded-2xl'>
						<Avatar className='h-16 w-16 border-4 border-white dark:border-zinc-800 shadow-xl'>
							<AvatarImage src={selectedItem.avatarUrl ?? ""} />
							<AvatarFallback className='text-xl font-bold bg-primary text-primary-foreground'>
								{selectedItem.clientName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className='flex-1 text-center sm:text-start space-y-1'>
							<h4 className='font-bold text-xl text-zinc-900 dark:text-zinc-100'>
								{selectedItem.clientName}
							</h4>
							<div className='flex items-center justify-center sm:justify-start gap-2 text-zinc-500'>
								<Mail className='h-4 w-4' />
								<span className='text-sm'>{selectedItem.email}</span>
							</div>
						</div>
						<div className='flex flex-col items-center sm:items-end gap-2 shrink-0'>
							<span className='text-[10px] uppercase tracking-widest text-zinc-400 font-black'>
								{t("colRating")}
							</span>
							<div className='flex bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={cn(
											"h-4 w-4",
											i < (selectedItem.rating || 0)
												? "fill-amber-400 text-amber-400"
												: "text-zinc-300 dark:text-zinc-700",
										)}
									/>
								))}
							</div>
						</div>
					</div>

					<div className='mt-6 flex justify-end'>
						<Button
							variant='ghost'
							onClick={onClose}
							className='hover:bg-zinc-100 rounded-xl'>
							{t("close")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
