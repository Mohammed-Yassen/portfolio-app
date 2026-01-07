/** @format */
"use client";

import * as React from "react";

import { Eye, EyeOff, AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure shadcn checkbox is installed

export const FormCheckboxWrapper = ({
	value,
	onChange,
	label,
	id,
}: {
	value: boolean;
	onChange: (val: boolean) => void;
	label: React.ReactNode;
	id: string;
}) => (
	<div className='flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-primary/5 border-primary/10 transition-colors hover:bg-primary/10'>
		<Checkbox id={id} checked={value} onCheckedChange={onChange} />
		<div className='grid gap-1.5 leading-none'>
			<label
				htmlFor={id}
				className='text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
				{label}
			</label>
		</div>
	</div>
);

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = React.forwardRef<
	HTMLInputElement,
	PasswordInputProps
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className='relative'>
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", className)}
				ref={ref}
				{...props}
			/>
			<Button
				type='button'
				variant='ghost'
				size='sm'
				className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground'
				onClick={() => setShowPassword((prev) => !prev)}
				disabled={props.disabled}>
				{showPassword ? (
					<EyeOff className='h-4 w-4' />
				) : (
					<Eye className='h-4 w-4' />
				)}
				<span className='sr-only'>
					{showPassword ? "Hide password" : "Show password"}
				</span>
			</Button>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";

/* -------------------------------------------------------------------------- */
/* FEEDBACK                                  */
/* -------------------------------------------------------------------------- */

export const FormError = ({ message }: { message?: string }) => {
	if (!message) return null;
	return (
		<div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-200'>
			<AlertTriangle className='h-4 w-4 shrink-0' />
			<p>{message}</p>
		</div>
	);
};

export const FormSuccess = ({ message }: { message?: string }) => {
	if (!message) return null;
	return (
		<div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-3 text-sm text-emerald-500 border border-emerald-500/20 animate-in fade-in zoom-in duration-200'>
			<CheckCircle2 className='h-4 w-4 shrink-0' />
			<p>{message}</p>
		</div>
	);
};
