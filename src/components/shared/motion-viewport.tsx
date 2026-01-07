/** @format */

"use client";

import * as React from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. تعريف الأنماط الحركية (Animation Presets)
const viewportVariants: Record<string, Variants> = {
	fadeInUp: {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	},
	scaleUp: {
		hidden: { opacity: 0, scale: 0.95 },
		visible: { opacity: 1, scale: 1 },
	},
};

// 2. أنماط التصميم باستخدام CVA
const sectionVariants = cva("relative w-full", {
	variants: {
		variant: {
			default: "",
			card: "rounded-xl border bg-card text-card-foreground shadow-sm",
			glass: "backdrop-blur-md bg-white/5 border border-white/10",
		},
		padding: {
			none: "",
			default: "py-16 md:py-24",
		},
	},
	defaultVariants: {
		variant: "default",
		padding: "none",
	},
});

// 3. تحسين تعريف الأنواع (TypeScript)
// نستخدم "any" في Omit فقط لتجنب التعارض العميق مع Framer Motion
interface MotionSectionProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "variant">,
		VariantProps<typeof sectionVariants> {
	preset?: keyof typeof viewportVariants;
	delay?: number;
	duration?: number;
	as?: "div" | "section" | "article" | "nav" | "li" | "ul" | "p";
	// إضافة خصائص Motion الأساسية التي قد تحتاجها خارج الـ preset
	viewport?: HTMLMotionProps<never>["viewport"];
}

const MotionSection = React.forwardRef<HTMLElement, MotionSectionProps>(
	(
		{
			className,
			variant,
			padding,
			preset = "fadeInUp",
			delay = 0,
			duration = 0.5,
			as = "section",
			viewport,
			...props
		},
		ref,
	) => {
		// اختيار المكون الحركي ديناميكياً
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Component = (motion as any)[as];

		return (
			<Component
				ref={ref}
				initial='hidden'
				whileInView='visible'
				// السماح بتخطي الإعدادات الافتراضية للـ viewport إذا تم تمريرها
				viewport={viewport || { once: true, margin: "-50px" }}
				variants={viewportVariants[preset]}
				transition={{
					duration,
					delay,
					ease: [0.21, 0.47, 0.32, 0.98],
				}}
				className={cn(sectionVariants({ variant, padding, className }))}
				{...props}
			/>
		);
	},
);

MotionSection.displayName = "MotionSection";

export { MotionSection, sectionVariants };
