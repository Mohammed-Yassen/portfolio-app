/** @format */

import { User } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";

interface UserCardProps {
	user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
	return (
		<Card className='flex items-center p-4 shadow-sm rounded-xl'>
			<div className='relative h-16 w-16 shrink-0'>
				<Image
					src={user.image || "/placeholder-avatar.jpg"}
					alt={user.name || "User"}
					fill
					className='rounded-full object-cover'
				/>
			</div>
			<CardContent className='ml-4 p-0'>
				<h3 className='text-lg font-semibold'>{user.name}</h3>
				<Badge variant='secondary' className='mt-1 text-xs'>
					{user.role}
				</Badge>
				<div className='mt-2 flex items-center text-sm text-muted-foreground'>
					<Mail className='mr-2 h-4 w-4' />
					{user.email}
				</div>
			</CardContent>
		</Card>
	);
};
