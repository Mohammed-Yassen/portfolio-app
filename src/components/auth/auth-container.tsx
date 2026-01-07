/** @format */
"use cleint";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { AuthSocial } from "./auth-social";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

interface AuthContainerProps {
	children: React.ReactNode;
	headerLabel: string;
	description?: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
	className?: string;
}

/**
 * A premium, reusable container for all authentication states (Login, Register, Error).
 * Features: Glassmorphism, Fade-in animation, and unified spacing.
 */
export const AuthContainer = ({
	children,
	headerLabel,
	description,
	backButtonHref,
	backButtonLabel,
	showSocial,
	className,
}: AuthContainerProps) => {
	return (
		<Card
			className={cn(
				// Layout & Sizing
				"w-full max-w-112.5 overflow-hidden transition-all duration-300",
				// Glassmorphism Styling
				"border border-border/40 shadow-2xl bg-background/80 backdrop-blur-md",
				// Animation (requires tailwind-animate)
				"animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500",
				className,
			)}>
			{/* Header: Logo and Titles */}
			<CardHeader className='pt-8 pb-4'>
				<AuthHeader label={headerLabel} description={description} />
			</CardHeader>

			{/* Main Form Area */}
			<CardContent className='px-8 py-4'>{children}</CardContent>

			{/* Footer: Social Login & Redirect Links */}
			<CardFooter className='flex flex-col gap-y-4 px-8 pb-8 pt-2'>
				{showSocial && (
					<div className='w-full'>
						<AuthSocial />
					</div>
				)}

				<AuthFooter href={backButtonHref} label={backButtonLabel} />
			</CardFooter>
		</Card>
	);
};

export const AuthHeader = ({
	label,
	description,
}: {
	label: string;
	description?: string;
}) => (
	<div className='flex flex-col items-center justify-center space-y-3'>
		<div className='p-2 bg-primary/5 rounded-2xl'>
			<Image
				src='/next.svg'
				alt='logo'
				width={40}
				height={40}
				className='dark:invert'
			/>
		</div>
		<div className='text-center'>
			<h1 className='text-2xl font-semibold tracking-tight'>{label}</h1>
			{description && (
				<p className='text-sm text-muted-foreground mt-1'>{description}</p>
			)}
		</div>
	</div>
);

export const AuthFooter = ({
	href,
	label,
}: {
	href: string;
	label: string;
}) => (
	<Button
		variant='link'
		className='w-full font-medium text-muted-foreground hover:text-primary'
		asChild>
		<Link href={href.startsWith("/") ? href : `/${href}`}>{label}</Link>
	</Button>
);
