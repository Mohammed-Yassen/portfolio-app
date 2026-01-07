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
interface FormFieldWrapperProps<T extends FieldValues, N extends FieldPath<T>> {
	control: Control<T>;
	name: N;
	label?: string;
	disabled?: boolean;
	children: (field: ControllerRenderProps<T, N>) => React.ReactNode;
}

export const FormFieldWrapper = <
	T extends FieldValues,
	N extends FieldPath<T>,
>({
	control,
	name,
	label,
	children,
	disabled,
}: FormFieldWrapperProps<T, N>) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				{label && (
					<FormLabel className='font-semibold text-zinc-700 dark:text-zinc-300'>
						{label}
					</FormLabel>
				)}
				<FormControl>{children(field)}</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);
