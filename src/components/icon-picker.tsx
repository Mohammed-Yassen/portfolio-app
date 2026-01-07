/** @format */

"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";

// Strict type for Icon components
type IconType = React.ComponentType<{ className?: string }>;

const AllIcons: Record<string, IconType> = {
	...(LucideIcons as unknown as Record<string, IconType>),
	...(FaIcons as unknown as Record<string, IconType>),
	...(MdIcons as unknown as Record<string, IconType>),
};

export function IconPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (val: string) => void;
}) {
	const [search, setSearch] = useState("");

	const filteredIconNames = useMemo(() => {
		const allNames = Object.keys(AllIcons);

		// Filter logic:
		// 1. Must be a function (Component)
		// 2. Must start with Uppercase (Standard for React Components)
		// 3. Exclude internal library objects like "IconContext"
		const validNames = allNames.filter((name) => {
			const potentialIcon = AllIcons[name];
			return (
				typeof potentialIcon === "function" &&
				/^[A-Z]/.test(name) &&
				name !== "IconContext"
			);
		});

		if (!search) return validNames.slice(0, 100);

		return validNames
			.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
			.slice(0, 100);
	}, [search]);

	// Safely get the Icon or fallback to HelpCircle
	const SelectedIcon: IconType = AllIcons[value] || HelpCircle;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					<div className='flex items-center gap-2'>
						<SelectedIcon className='h-4 w-4 text-muted-foreground' />
						<span className='truncate'>{value || "Select Icon"}</span>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-80 p-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
				align='start'>
				<Input
					placeholder='Search icons...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='mb-2'
				/>
				<ScrollArea className='h-72'>
					<div className='grid grid-cols-5 gap-1'>
						{filteredIconNames.map((name) => {
							const Icon: IconType = AllIcons[name];

							return (
								<Button
									key={name}
									type='button' // Important: prevents form submission
									variant='ghost'
									size='icon'
									title={name}
									onClick={() => {
										onChange(name);
										setSearch("");
									}}
									className={
										value === name
											? "bg-accent text-accent-foreground"
											: "hover:bg-muted"
									}>
									<Icon className='h-5 w-5' />
								</Button>
							);
						})}
					</div>
					{filteredIconNames.length === 0 && (
						<div className='p-8 text-center text-sm text-zinc-500'>
							No icons found.
						</div>
					)}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
