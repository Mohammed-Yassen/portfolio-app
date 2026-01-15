/** @format */
import React from "react";
import * as LucideIcons from "lucide-react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { HelpCircle, LucideProps } from "lucide-react";

type IconComponentType = React.ComponentType<LucideProps>;

export const AllIcons: Record<string, IconComponentType> = {
	...(LucideIcons as unknown as Record<string, IconComponentType>),
	...(FaIcons as unknown as Record<string, IconComponentType>),
	...(MdIcons as unknown as Record<string, IconComponentType>),
};

interface DynamicIconProps extends LucideProps {
	name: string;
}

// In a .ts file, we use React.createElement instead of <Icon />
export const DynamicIcon = ({
	name,
	...props
}: DynamicIconProps): React.ReactElement => {
	const IconComponent = AllIcons[name] || HelpCircle;

	return React.createElement(IconComponent, props);
};
