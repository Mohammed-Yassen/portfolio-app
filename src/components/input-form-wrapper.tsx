/** @format */

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Control,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps<T extends FieldValues, N extends FieldPath<T>> {
	control: Control<T>;
	name: N;
	label?: string;
	description?: string; // Added for better UX
	disabled?: boolean;
	locale?: string; // Pass 'ar' or 'en'
	className?: string;
	children: (field: ControllerRenderProps<T, N>) => React.ReactNode;
}

export const FormFieldWrapper = <
	T extends FieldValues,
	N extends FieldPath<T>,
>({
	control,
	name,
	label,
	description,
	children,
	locale,
	className,
}: FormFieldWrapperProps<T, N>) => {
	const isRtl = locale === "ar";

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("space-y-2", className)}>
					{label && (
						<FormLabel
							// dir={isRtl ? "rtl" : "ltr"}
							className={cn(
								"text-sm font-bold tracking-tight text-zinc-700 dark:text-zinc-300",
								// Use text-start so it aligns left in EN and right in AR automatically
								"text-start block",
								isRtl && "font-arabic", // Optional: apply a specific Arabic font if needed
							)}>
							{label}
						</FormLabel>
					)}

					<FormControl>
						{/* We wrap the child in a div with the correct direction context */}
						<div>{children(field)}</div>
					</FormControl>

					{description && (
						<p className='text-[0.8rem] text-muted-foreground text-start'>
							{description}
						</p>
					)}

					<FormMessage
						className={cn("text-xs font-medium", isRtl && "text-start")}
					/>
				</FormItem>
			)}
		/>
	);
};
