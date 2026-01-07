/** @format */
import * as LucideIcons from "lucide-react";
import * as SiIcons from "react-icons/si";
import { LucideIcon, Layers } from "lucide-react";
import { IconType } from "react-icons";

export type IconComponentType = LucideIcon | IconType;

export const resolveIcon = (
	name: string | null | undefined,
): IconComponentType => {
	if (!name) return Layers;

	// Try Lucide
	if (name in LucideIcons)
		return (LucideIcons as keyof typeof LucideIcons)[name];
	// Try Simple Icons (for Tools like Docker, Figma, etc.)
	if (name in SiIcons) return (SiIcons as keyof typeof SiIcons)[name];

	return Layers;
};
