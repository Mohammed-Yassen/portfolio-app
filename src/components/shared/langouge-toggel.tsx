/** @format */

// components/shared/LanguageToggle.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
	const pathname = usePathname();
	const router = useRouter();

	const toggleLang = () => {
		const segments = pathname.split("/");
		const nextLocale = segments[1] === "en" ? "ar" : "en";
		segments[1] = nextLocale;
		router.push(segments.join("/"));
	};

	return (
		<Button onClick={toggleLang} variant='ghost'>
			{pathname.startsWith("/ar") ? "English" : "العربية"}
		</Button>
	);
}
