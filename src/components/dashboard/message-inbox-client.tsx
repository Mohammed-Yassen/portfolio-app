/** @format */
"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import {
	Search,
	Star,
	Trash2,
	Archive,
	ChevronLeft,
	Mail,
	Inbox,
	Reply,
	MailOpen,
	ShieldAlert,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { manageMessage, type MessageAction } from "@/server/actions/contact";
import { type ContactMessageValues } from "@/server/validations/contact";

type FilterType =
	| "ALL"
	| "STARRED"
	| "ARCHIVED"
	| "UNREAD"
	| "REPLIED"
	| "SPAM";

interface MessageInboxProps {
	initialMessages: ContactMessageValues[];
}

export function MessageInboxClient({ initialMessages }: MessageInboxProps) {
	const [filter, setFilter] = React.useState<FilterType>("ALL");
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [isPending, startTransition] = React.useTransition();

	// Memoized filtering for performance
	const filteredMessages = React.useMemo(() => {
		return initialMessages.filter((m) => {
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				m.name.toLowerCase().includes(searchLower) ||
				m.email.toLowerCase().includes(searchLower) ||
				(m.subject?.toLowerCase() || "").includes(searchLower);

			if (!matchesSearch) return false;

			switch (filter) {
				case "STARRED":
					return m.priority === true;
				case "ARCHIVED":
					return m.status === "ARCHIVED";
				case "UNREAD":
					return m.status === "UNREAD";
				case "REPLIED":
					return m.status === "REPLIED";
				case "SPAM":
					return m.status === "SPAM";
				default:
					return m.status !== "ARCHIVED" && m.status !== "SPAM";
			}
		});
	}, [initialMessages, filter, searchQuery]);

	const selectedMessage = initialMessages.find((m) => m.id === selectedId);

	const handleAction = (type: MessageAction) => {
		if (!selectedId) return;
		startTransition(async () => {
			const res = await manageMessage(selectedId, type);
			if (res.success) {
				toast.success(
					`Message ${type.replace("_", " ").toLowerCase()} success`,
				);
				if (["DELETE", "ARCHIVE", "SPAM"].includes(type)) setSelectedId(null);
			} else {
				toast.error(res.error || "Action failed");
			}
		});
	};

	const onReply = () => {
		if (!selectedMessage) return;
		window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${
			selectedMessage.subject || "Inquiry"
		}`;
		handleAction("REPLIED");
	};

	return (
		<div className='flex h-[calc(100vh-8rem)] w-full bg-background overflow-hidden border rounded-xl shadow-sm'>
			{/* 1. SIDE NAVIGATION */}
			<nav className='w-16 md:w-20 border-r flex flex-col items-center py-6 gap-4 bg-zinc-50/50 dark:bg-zinc-950/20'>
				<NavButton
					active={filter === "ALL"}
					onClick={() => setFilter("ALL")}
					icon={<Inbox className='w-5 h-5' />}
					label='Inbox'
				/>
				<NavButton
					active={filter === "UNREAD"}
					onClick={() => setFilter("UNREAD")}
					icon={<Mail className='w-5 h-5' />}
					label='Unread'
				/>
				<NavButton
					active={filter === "REPLIED"}
					onClick={() => setFilter("REPLIED")}
					icon={<Reply className='w-5 h-5' />}
					label='Replied'
				/>
				<NavButton
					active={filter === "STARRED"}
					onClick={() => setFilter("STARRED")}
					icon={<Star className='w-5 h-5' />}
					label='Starred'
				/>
				<NavButton
					active={filter === "ARCHIVED"}
					onClick={() => setFilter("ARCHIVED")}
					icon={<Archive className='w-5 h-5' />}
					label='Archive'
				/>
				<NavButton
					active={filter === "SPAM"}
					onClick={() => setFilter("SPAM")}
					icon={<ShieldAlert className='w-5 h-5' />}
					label='Spam'
				/>
			</nav>

			{/* 2. MESSAGE LIST */}
			<aside
				className={cn(
					"w-full md:w-80 lg:w-96 border-r flex flex-col transition-all bg-background",
					selectedId ? "hidden md:flex" : "flex",
				)}>
				<div className='p-6 border-b flex items-center justify-between'>
					<h1 className='text-xl font-bold tracking-tight capitalize'>
						{filter.toLowerCase()}
					</h1>
					<span className='text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full'>
						{filteredMessages.length}
					</span>
				</div>
				<div className='p-4 border-b'>
					<div className='relative'>
						<Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50' />
						<Input
							placeholder='Search conversations...'
							className='pl-9 bg-muted/30 border-none'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<ScrollArea className='flex-1'>
					{filteredMessages.map((msg) => (
						<MessageItem
							key={msg.id}
							msg={msg}
							isSelected={selectedId === msg.id}
							onClick={() => {
								setSelectedId(msg.id!);
								if (msg.status === "UNREAD") handleAction("TOGGLE_READ");
							}}
						/>
					))}
				</ScrollArea>
			</aside>

			{/* 3. DETAIL VIEW */}
			<main
				className={cn(
					"flex-1 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/10",
					!selectedId ? "hidden md:flex items-center justify-center" : "flex",
				)}>
				{selectedMessage ? (
					<>
						<div className='h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-md'>
							<div className='flex items-center gap-1'>
								<Button
									variant='ghost'
									size='icon'
									className='md:hidden'
									onClick={() => setSelectedId(null)}>
									<ChevronLeft />
								</Button>
								<ActionButton
									icon={<Archive className='w-4 h-4' />}
									title='Archive'
									onClick={() => handleAction("ARCHIVE")}
									disabled={isPending}
								/>
								<ActionButton
									icon={<ShieldAlert className='w-4 h-4' />}
									title='Spam'
									onClick={() => handleAction("SPAM")}
									disabled={isPending}
								/>
								<ActionButton
									icon={<Trash2 className='w-4 h-4' />}
									title='Delete'
									onClick={() => handleAction("DELETE")}
									disabled={isPending}
									className='hover:text-destructive'
								/>
								<Separator orientation='vertical' className='h-4 mx-2' />
								<Button
									variant='ghost'
									size='icon'
									onClick={() => handleAction("TOGGLE_STAR")}
									className={selectedMessage.priority ? "text-yellow-500" : ""}>
									<Star
										fill={selectedMessage.priority ? "currentColor" : "none"}
										className='w-4 h-4'
									/>
								</Button>
							</div>
							<Button
								size='sm'
								className='gap-2'
								onClick={onReply}
								disabled={isPending}>
								{isPending ? (
									<Loader2 className='w-4 h-4 animate-spin' />
								) : (
									<Reply className='h-4 w-4' />
								)}
								Reply
							</Button>
						</div>
						<ScrollArea className='flex-1 p-6 md:p-12'>
							<article className='max-w-3xl mx-auto'>
								<div className='mb-6'>
									<StatusBadge status={selectedMessage.status!} />
								</div>
								<h2 className='text-3xl font-bold mb-8'>
									{selectedMessage.subject || "No Subject"}
								</h2>
								<div className='flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border mb-10'>
									<div className='h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold'>
										{selectedMessage.name.charAt(0)}
									</div>
									<div className='flex-1 text-sm'>
										<p className='font-bold'>{selectedMessage.name}</p>
										<p className='text-muted-foreground'>
											{selectedMessage.email}
										</p>
									</div>
									{selectedMessage.createdAt && (
										<time className='text-[10px] uppercase font-medium opacity-60'>
											{formatDistanceToNow(
												new Date(selectedMessage.createdAt),
												{ addSuffix: true },
											)}
										</time>
									)}
								</div>
								<div className='text-base leading-relaxed whitespace-pre-wrap text-foreground/90'>
									{selectedMessage.message}
								</div>
							</article>
						</ScrollArea>
					</>
				) : (
					<EmptyState />
				)}
			</main>
		</div>
	);
}

/** * HELPER COMPONENTS
 */

function NavButton({
	active,
	onClick,
	icon,
	label,
}: {
	active: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"p-3 rounded-xl transition-all group relative",
				active
					? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
					: "hover:bg-muted text-muted-foreground",
			)}>
			{icon}
			<span className='absolute left-full ml-4 px-2 py-1 bg-popover border rounded text-[10px] opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap shadow-sm transition-opacity'>
				{label}
			</span>
		</button>
	);
}

function MessageItem({
	msg,
	isSelected,
	onClick,
}: {
	msg: ContactMessageValues;
	isSelected: boolean;
	onClick: () => void;
}) {
	const isUnread = msg.status === "UNREAD";
	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full text-left p-5 border-b transition-all relative",
				isSelected ? "bg-primary/5" : "hover:bg-muted/30",
			)}>
			{isUnread && (
				<div className='absolute left-0 top-0 bottom-0 w-1 bg-primary' />
			)}
			<div className='flex justify-between items-center mb-1'>
				<span
					className={cn(
						"text-xs truncate max-w-[150px]",
						isUnread ? "font-bold text-primary" : "text-muted-foreground",
					)}>
					{msg.name}
				</span>
				{msg.createdAt && (
					<span className='text-[10px] opacity-60'>
						{formatDistanceToNow(new Date(msg.createdAt))}
					</span>
				)}
			</div>
			<div
				className={cn(
					"text-sm truncate",
					isUnread ? "font-bold" : "text-foreground/80",
				)}>
				{msg.subject || "(No Subject)"}
			</div>
		</button>
	);
}

function StatusBadge({ status }: { status: string }) {
	const styles: Record<string, string> = {
		UNREAD: "bg-blue-500/10 text-blue-600 border-blue-200",
		READ: "bg-zinc-500/10 text-zinc-600 border-zinc-200",
		REPLIED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
		ARCHIVED: "bg-orange-500/10 text-orange-600 border-orange-200",
		SPAM: "bg-red-500/10 text-red-600 border-red-200",
	};
	return (
		<span
			className={cn(
				"px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider",
				styles[status] || styles.READ,
			)}>
			{status}
		</span>
	);
}

function ActionButton({
	icon,
	title,
	onClick,
	disabled,
	className,
}: {
	icon: React.ReactNode;
	title: string;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<Button
			variant='ghost'
			size='icon'
			title={title}
			onClick={onClick}
			disabled={disabled}
			className={className}>
			{icon}
		</Button>
	);
}

function EmptyState() {
	return (
		<div className='text-center space-y-4 opacity-30'>
			<Mail className='h-12 w-12 mx-auto' />
			<p className='text-sm font-medium italic'>
				Select a message to view details
			</p>
		</div>
	);
}
