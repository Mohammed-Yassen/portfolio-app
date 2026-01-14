/** @format */
"use client";

import { UserRole } from "@prisma/client";
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldAlert, Trash2, Edit, UserX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// Import the custom safe type we created earlier
import { UserWithProfile } from "@/types/user";

interface UsersTableProps {
	data: UserWithProfile[];
}

export function UsersTable({ data }: UsersTableProps) {
	// Senior UX: Handle empty states gracefully
	if (data.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card'>
				<div className='p-4 rounded-full bg-muted mb-4'>
					<UserX className='h-8 w-8 text-muted-foreground' />
				</div>
				<h3 className='font-semibold text-lg'>No users found</h3>
				<p className='text-muted-foreground'>
					There are no registered users in the database.
				</p>
			</div>
		);
	}

	return (
		<div className='rounded-xl border bg-card overflow-hidden'>
			<Table>
				<TableHeader className='bg-muted/50'>
					<TableRow>
						<TableHead className='w-[300px]'>User</TableHead>
						<TableHead>Role</TableHead>
						<TableHead className='hidden md:table-cell'>Joined</TableHead>
						<TableHead className='hidden lg:table-cell'>Contact</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((user) => (
						<TableRow
							key={user.id}
							className='hover:bg-muted/30 transition-colors'>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<Avatar className='h-10 w-10 border shadow-sm'>
										<AvatarImage
											src={user?.image || ""}
											alt={user.name || "User"}
										/>
										<AvatarFallback className='bg-primary/5 text-primary'>
											{user.name?.substring(0, 2).toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<div className='flex flex-col'>
										<span className='text-sm font-semibold leading-none mb-1'>
											{user.name || "Anonymous"}
										</span>
										<span className='text-xs text-muted-foreground truncate max-w-[150px]'>
											{user.email}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<Badge
									variant={
										user.role === UserRole.ADMIN ? "default" : "secondary"
									}
									className='capitalize font-medium'>
									{user.role.toLowerCase()}
								</Badge>
							</TableCell>
							<TableCell className='hidden md:table-cell text-muted-foreground text-sm'>
								{user.createdAt
									? new Date(user.createdAt).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
											year: "numeric",
									  })
									: "N/A"}
							</TableCell>
							<TableCell className='hidden lg:table-cell'>
								<span className='text-xs text-muted-foreground'>
									{user.profile?.phone || "No phone"}
								</span>
							</TableCell>
							<TableCell className='text-right'>
								<UserActions user={user} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

/** @format */
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteUser, updateRole } from "@/server/actions/user";

interface UsersTableProps {
	data: UserWithProfile[];
}

export function UserActions({ user }: { user: UserWithProfile }) {
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const onRoleChange = (newRole: UserRole) => {
		startTransition(async () => {
			// Match the schema { targetUserId, role }
			const res = await updateRole({
				targetUserId: user.id,
				role: newRole,
			});

			if (res.success) toast.success(res.success);
			else if (res.error) toast.error(res.error);
		});
	};

	const onDelete = () => {
		startTransition(async () => {
			// Match the schema { targetUserId }
			const res = await deleteUser({ targetUserId: user.id });
			if (res.success) {
				toast.success(res.success);
				setShowDeleteDialog(false);
			} else toast.error(res.error);
		});
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon' disabled={isPending}>
						{isPending ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<MoreHorizontal className='h-4 w-4' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-48'>
					{/* Role Management Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<ShieldAlert className='mr-2 h-4 w-4' /> Role: {user.role}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => onRoleChange(UserRole.ADMIN)}>
									Promote to Admin
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onRoleChange(UserRole.USER)}>
									Demote to User
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						className='text-destructive'>
						<Trash2 className='mr-2 h-4 w-4' /> Delete User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete <b>{user.name}</b> and all associated
							data. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={onDelete}
							className='bg-destructive hover:bg-destructive/90'>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
