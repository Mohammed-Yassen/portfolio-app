/** @format */

import { User } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";

interface UserProfileCardProps {
	user: User;
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
	return (
		<Card className='flex items-center p-4 shadow-sm rounded-xl'>
			<div className='relative h-24 w-24 shrink-0'>
				<Image
					src={user.image || "/placeholder-avatar.jpg"}
					alt={user.name || "User"}
					fill
					className='rounded-full object-cover'
				/>
			</div>
			<CardContent className='ml-4 p-0'>
				<h3 className='text-xl font-semibold'>{user.name}</h3>
				<Badge variant='secondary' className='mt-1 text-sm'>
					{user.role}
				</Badge>
				<div className='mt-3 flex flex-col gap-1 text-sm text-muted-foreground'>
					{user.email && (
						<div className='flex items-center'>
							<Mail className='mr-2 h-4 w-4' />
							{user.email}
						</div>
					)}
					{/* {user.phoneNumbers?.[0] && (
						<div className='flex items-center'>
							<Phone className='mr-2 h-4 w-4' />
							{user.phoneNumbers[0]}
						</div>
					)} */}
					{/* {user.address && (
						<div className='flex items-center'>
							<MapPin className='mr-2 h-4 w-4' />
							{user.address}
						</div>
					)} */}
				</div>
			</CardContent>
		</Card>
	);
};
