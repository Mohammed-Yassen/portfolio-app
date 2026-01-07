/** @format */
import { SignUpForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create an Account | Admin Portal",
	description: "Join our platform to manage your portfolio and settings.",
};

export default function SignUpPage() {
	return (
		<main className='relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20'>
			{/* 1. Background Visuals (Senior Touch: Ambient Blobs) */}
			<div className='absolute inset-0 z-0'>
				<div className='absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse' />
				<div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-700' />
			</div>

			{/* 2. Content Layer */}
			<section className='relative z-10 w-full max-w-112.5'>
				<SignUpForm />
			</section>

			{/* 3. Global Footer (Optional tiny links) */}
			<footer className='absolute bottom-4 text-center w-full text-xs text-slate-500'>
				&copy; {new Date().getFullYear()} Your Brand Inc. All rights reserved.
			</footer>
		</main>
	);
}
