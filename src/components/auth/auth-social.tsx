/** @format */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { IconType } from "react-icons";
import { FaGithub } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";
import { Button } from "../ui/button";

// Senior Tip: Define your default redirect in a central config file later
const DEFAULT_LOGIN_REDIRECT = "/dashboard";

const SOCIAL_PROVIDERS = [
	{
		id: "google",
		label: "Google",
		icon: BsGoogle,
		color: "text-[#DB4437]", // Specific Google Brand Red
	},
	{
		id: "github",
		label: "GitHub",
		icon: FaGithub,
		color: "text-zinc-900 dark:text-zinc-100",
	},
] as const;

export const AuthSocial = () => {
	const searchParams = useSearchParams();

	// 1. Get the callbackUrl from the URL, or fallback to your default dashboard
	const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;

	return (
		<div className='space-y-4 w-full'>
			<div className='relative flex items-center py-2'>
				<span className='w-full border-t' />
				<span className='relative bg-background px-2 text-[10px] text-muted-foreground uppercase font-semibold whitespace-nowrap'>
					Or continue with
				</span>
				<span className='w-full border-t' />
			</div>

			<div className='grid grid-cols-1 gap-3'>
				{SOCIAL_PROVIDERS.map((provider) => (
					<OAuthSubmit
						key={provider.id}
						provider={provider.id as "google" | "github"}
						label={provider.label}
						icon={provider.icon}
						iconColor={provider.color}
						callbackUrl={callbackUrl}
					/>
				))}
			</div>
		</div>
	);
};

interface OAuthSubmitProps {
	provider: "google" | "github";
	label: string;
	icon: IconType;
	style?: string;
	iconColor?: string;
	callbackUrl: string; // Required for clean redirects
}

export const OAuthSubmit = ({
	provider,
	label,
	icon: Icon,
	style,
	iconColor,
	callbackUrl, // 2. Correctly destructure this from props
}: OAuthSubmitProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			// 3. Trigger the sign in with the dynamic redirect path
			await signIn(provider, {
				callbackUrl,
			});
		} catch (error) {
			setIsLoading(false);
			console.error(`${label} login failed`, error);
		}
	};

	return (
		<Button
			type='button'
			variant='outline'
			size='lg'
			className={cn(
				"w-full relative group overflow-hidden border-border/50 bg-background hover:bg-accent transition-all duration-300",
				style,
			)}
			disabled={isLoading}
			onClick={onClick}>
			{isLoading ? (
				<Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
			) : (
				<div className='flex items-center justify-center gap-3 w-full'>
					<Icon
						className={cn(
							"h-5 w-5 transition-transform duration-300 group-hover:scale-110",
							iconColor,
						)}
					/>
					<span className='font-medium'>Continue with {label}</span>
				</div>
			)}
			{/* Subtle interactive hover effect */}
			<div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
		</Button>
	);
};
