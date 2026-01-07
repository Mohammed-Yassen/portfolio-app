/** @format */
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface BackButtonProps {
	className?: string;
	variant?: "ghost" | "outline" | "default" | "secondary";
	title?: string;
	icon?: LucideIcon;
	children?: React.ReactNode;
	fallback?: string; // Add a fallback prop
}

export function BackButton({
	fallback = "/", // Add a fallback prop
	title = "Back",
	icon: Icon = ChevronLeft,
	className,
	variant = "ghost",
}: BackButtonProps) {
	const router = useRouter();

	const handleBack = () => {
		// Senior logic: Check if there is history to go back to
		if (typeof window !== "undefined" && window.history.length > 1) {
			router.back();
		} else {
			router.push(fallback); // If no history, go to home/dashboard
		}
	};

	return (
		<Button
			variant={variant}
			onClick={handleBack}
			className={cn(
				"group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all",
				className,
			)}>
			<Icon className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
			<span className='font-medium'>{title}</span>
		</Button>
	);
}
