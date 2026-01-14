/** @format */
import * as LucideIcons from "lucide-react";
import * as SiIcons from "react-icons/si";
import { LucideIcon, Layers } from "lucide-react";
import { IconType } from "react-icons";

/**
 * Senior Tip: We use 'any' as a fallback because icon libraries
 * have massive union types that can slow down TS performance
 * in large loops, but we keep the return type strict.
 */
export type IconComponentType = LucideIcon | IconType;

export const resolveIcon = (
	name: string | null | undefined,
): IconComponentType => {
	// Default fallback icon
	if (!name) return Layers;

	try {
		// 1. Check Lucide Icons
		// Use type assertion to access the object by string key
		const LucideIcon = (LucideIcons as never)[name];
		if (LucideIcon) return LucideIcon;

		// 2. Check Simple Icons (react-icons/si)
		const SiIcon = (SiIcons as Record<string, IconType>)[name];
		if (SiIcon) return SiIcon;
	} catch (error) {
		console.warn(
			`Icon "${name}" not found in libraries. Falling back to Layers.`,
		);
	}

	// Final fallback if no icon is found in either library
	return Layers;
};
