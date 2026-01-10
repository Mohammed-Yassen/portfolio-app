/** @format */

"use client";

import { type Editor } from "@tiptap/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { BoldToolbar } from "../toolbars/bold";
import { ItalicToolbar } from "../toolbars/italic";
import { UnderlineToolbar } from "../toolbars/underline";
import { LinkToolbar } from "../toolbars/link";
import { ColorHighlightToolbar } from "../toolbars/color-and-highlight";
import { ToolbarProvider } from "../toolbars/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { HeadingsToolbar } from "../toolbars/headings";
import { useMediaQuery } from "@/app/hooks/use-media-querry";
import { cn } from "@/lib/utils";

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [show, setShow] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const menuRef = useRef<HTMLDivElement>(null);

	const updatePosition = useCallback(() => {
		if (!editor || !editor.isFocused || editor.state.selection.empty) {
			setShow(false);
			return;
		}

		const { view } = editor;
		const { state } = view;
		const { from, to } = state.selection;

		try {
			const start = view.coordsAtPos(from);
			const end = view.coordsAtPos(to);

			// Calculate horizontal center
			let left = (start.left + end.left) / 2;
			const top = start.top - 12; // Gap above selection

			// --- RESPONSIVE BOUNDARY CHECK ---
			const menuWidth = 320; // Rough width of your menu
			const padding = 20;

			// Prevent left overflow
			if (left - menuWidth / 2 < padding) {
				left = menuWidth / 2 + padding;
			}
			// Prevent right overflow
			if (left + menuWidth / 2 > window.innerWidth - padding) {
				left = window.innerWidth - (menuWidth / 2 + padding);
			}

			setPosition({ top, left });
			setShow(true);
		} catch (e) {
			setShow(false);
		}
	}, [editor]);

	useEffect(() => {
		if (!editor) return;
		editor.on("selectionUpdate", updatePosition);
		editor.on("focus", updatePosition);
		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			editor.off("selectionUpdate", updatePosition);
			editor.off("focus", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [editor, updatePosition]);

	// On mobile, floating bars hide to prevent keyboard overlap issues
	if (!editor || !show || isMobile) return null;

	return createPortal(
		<div
			ref={menuRef}
			className={cn(
				"fixed z-[9999] -translate-x-1/2 -translate-y-full pb-2 transition-all duration-200 ease-out",
				show
					? "opacity-100 scale-100"
					: "opacity-0 scale-95 pointer-events-none",
			)}
			style={{
				top: `${position.top}px`,
				left: `${position.left}px`,
			}}>
			<div className='flex items-center gap-0.5 rounded-xl border bg-background/95 backdrop-blur-sm p-1 shadow-2xl'>
				<TooltipProvider delayDuration={0}>
					<ToolbarProvider editor={editor}>
						<div className='flex items-center gap-0.5'>
							<BoldToolbar />
							<ItalicToolbar />
							<UnderlineToolbar />
							<Separator orientation='vertical' className='mx-1 h-4' />
							<HeadingsToolbar />
							<LinkToolbar />
							<ColorHighlightToolbar />
						</div>
					</ToolbarProvider>
				</TooltipProvider>
			</div>
		</div>,
		document.body,
	);
}
