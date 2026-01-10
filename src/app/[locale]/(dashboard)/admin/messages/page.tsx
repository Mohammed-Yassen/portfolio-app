/** @format */
import { MessageInboxClient } from "@/components/dashboard/message-inbox-client";
import { Mail } from "lucide-react";
import prisma from "@/lib/prisma"; // Corrected import

export default async function AdminMessagesPage() {
	// Fetch data on the server with correct typing
	const messages = await prisma.contactMessage.findMany({
		orderBy: { createdAt: "desc" },
	});

	// Transform data to match your Zod types if necessary
	const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

	return (
		<div className='flex flex-col h-[calc(100vh-4rem)] p-4 md:p-8 gap-4'>
			<header className='flex items-center justify-between border-b bg-background pb-4'>
				<div className='flex items-center gap-2'>
					<Mail className='w-5 h-5 text-primary' />
					<h1 className='text-xl font-semibold'>Inbox</h1>
					<span className='ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full font-medium'>
						{unreadCount} Unread
					</span>
				</div>
			</header>

			{/* The Interactive Client View */}
			<div className='flex-1 min-h-0'>
				<MessageInboxClient initialMessages={messages} />
			</div>
		</div>
	);
}
