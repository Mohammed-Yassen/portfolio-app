/** @format */

import { SignInForm } from "@/components/auth/login-form";
/** @format */
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign In | Admin Portal",
	description:
		"Welcome back! Please enter your credentials to access your account.",
};

export default function SignInPage() {
	return (
		<main className='relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background px-4 py-20 transition-colors duration-500'>
			{/* 1. Adaptive Background Visuals */}
			<div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
				{/* Top-left glow: Blue in dark, light sky-blue in light mode */}
				<div className='absolute top-1/4 -left-20 h-120  w-120 bg-blue-500/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse' />

				{/* Bottom-right glow: Purple/Pink in dark, soft lavender in light mode */}
				<div className='absolute bottom-1/4 -right-20  h-120  w-120 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse delay-700' />
			</div>

			{/* 2. Form Content */}
			<section className='relative z-10 w-full max-w-112.5'>
				{/* The form components use Shadcn, which automatically adapts to dark/light */}
				<SignInForm />
			</section>

			<footer className='absolute bottom-4 text-center w-full text-xs text-muted-foreground/60'>
				&copy; {new Date().getFullYear()} Your Brand Inc.
			</footer>
		</main>
	);
}
