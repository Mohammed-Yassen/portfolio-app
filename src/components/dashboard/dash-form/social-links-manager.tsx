/** @format */
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSocialLink, deleteSocialLink } from "@/actions/user";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Trash2,
	Plus,
	Globe,
	Loader2,
	Share2,
	Link as LinkIcon,
} from "lucide-react";
import { socialLinkSchema, SocialLinkValues } from "@/lib/validations/user";
import { FormFieldWrapper } from "@/components/input-form-wrapper";

export function SocialLinksManager({
	initialLinks,
	profileId,
}: {
	initialLinks: any[];
	profileId: string;
}) {
	const [links, setLinks] = useState(initialLinks);
	const [isPending, startTransition] = useTransition();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const form = useForm<SocialLinkValues>({
		resolver: zodResolver(socialLinkSchema),
		defaultValues: { name: "", url: "", icon: "" },
	});

	const onAdd = async (values: SocialLinkValues) => {
		startTransition(async () => {
			const res = await createSocialLink(values); // Ensure action uses profileId internally
			if (res.success) {
				setLinks((prev) => [...prev, res.data]);
				form.reset();
				toast.success(res.success);
			} else toast.error(res.error);
		});
	};

	const onDelete = async (id: string) => {
		setDeletingId(id);
		const res = await deleteSocialLink(id);
		if (res.success) {
			setLinks((prev) => prev.filter((l) => l.id !== id));
			toast.success(res.success);
		} else toast.error(res.error);
		setDeletingId(null);
	};

	return (
		<div className='space-y-8'>
			<div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 border-b border-zinc-100 dark:border-zinc-800 pb-3'>
				<Share2 size={20} />
				<h4 className='font-bold uppercase tracking-tight text-sm'>
					Social Connections
				</h4>
			</div>

			{/* Creation Form */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onAdd)}
					className='grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800'>
					<div className='md:col-span-4'>
						<FormFieldWrapper
							control={form.control}
							name='name'
							label='Platform'>
							{(field) => (
								<Input
									{...field}
									placeholder='GitHub'
									className='bg-white dark:bg-zinc-950 border-none h-11'
								/>
							)}
						</FormFieldWrapper>
					</div>
					<div className='md:col-span-6'>
						<FormFieldWrapper
							control={form.control}
							name='url'
							label='Link URL'>
							{(field) => (
								<Input
									{...field}
									placeholder='https://...'
									className='bg-white dark:bg-zinc-950 border-none h-11'
								/>
							)}
						</FormFieldWrapper>
					</div>
					<div className='md:col-span-2 flex items-end'>
						<Button
							type='submit'
							disabled={isPending}
							className='w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl'>
							{isPending ? (
								<Loader2 className='animate-spin' size={18} />
							) : (
								<Plus size={18} />
							)}
						</Button>
					</div>
				</form>
			</Form>

			{/* Links Display */}
			<div className='grid gap-4'>
				{links.map((link) => (
					<div
						key={link.id}
						className='group flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-all'>
						<div className='flex items-center gap-4'>
							<div className='p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'>
								<LinkIcon size={18} />
							</div>
							<div>
								<p className='text-sm font-bold text-zinc-900 dark:text-zinc-100'>
									{link.name}
								</p>
								<p className='text-xs text-zinc-500 truncate max-w-[200px] md:max-w-xs'>
									{link.url}
								</p>
							</div>
						</div>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => onDelete(link.id)}
							disabled={deletingId === link.id}
							className='text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'>
							{deletingId === link.id ? (
								<Loader2 className='animate-spin' size={16} />
							) : (
								<Trash2 size={16} />
							)}
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
