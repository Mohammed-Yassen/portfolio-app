/** @format */

"use client";

import "./tiptap.css";
import { useEffect, useMemo } from "react";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";

// Custom Extensions
import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace";
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu";
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";

// UI Components
import { EditorToolbar } from "./toolbars/editor-toolbar";
import { useMediaQuery } from "@/app/hooks/use-media-querry";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

interface RichTextEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function RichTextEditor({
	value,
	onChange,
	className,
}: RichTextEditorProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");

	// Memoize extensions to prevent unnecessary re-renders
	const extensions = useMemo(
		() => [
			StarterKit.configure({
				orderedList: {
					HTMLAttributes: { class: "list-decimal pl-6 space-y-2" },
				},
				bulletList: { HTMLAttributes: { class: "list-disc pl-6 space-y-2" } },
				heading: { levels: [1, 2, 3, 4] },
				codeBlock: {
					HTMLAttributes: {
						class: "rounded-md bg-muted p-4 font-mono text-sm",
					},
				},
			}),
			Placeholder.configure({
				emptyNodeClass: "is-editor-empty",
				placeholder: "Write something amazing, or type '/' for commands...",
				includeChildren: false,
			}),
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TextStyle,
			Subscript,
			Superscript,
			Underline,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-primary underline cursor-pointer font-medium",
				},
			}),
			Color,
			Highlight.configure({ multicolor: true }),
			CharacterCount,
			ImageExtension,
			ImagePlaceholder,
			SearchAndReplace,
			Typography,
		],
		[],
	);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: extensions as Extension[],
		content: value || "",
		editorProps: {
			attributes: {
				// Highly responsive prose: adjusts font size based on screen width
				class: cn(
					"prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert",
					"max-w-none focus:outline-none",
					"min-h-[400px] sm:min-h-[600px]", // Increased height for better UX
					"px-4 py-8 sm:px-12 sm:py-16", // Generous whitespace like Medium.com
					"selection:bg-primary/20",
				),
			},
		},
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
	});

	// Sync external value changes (e.g., Form Reset)
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value || "");
		}
	}, [value, editor]);

	if (!editor) return null;

	return (
		<div
			className={cn(
				"relative flex flex-col w-full bg-background border rounded-xl shadow-sm transition-all duration-300",
				"focus-within:ring-2 focus-within:ring-primary/5 focus-within:border-primary/20",
				className,
			)}>
			{/* 1. DESKTOP TOOLBAR (Sticky at Top) */}
			{!isMobile && (
				<div className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl rounded-t-xl overflow-hidden'>
					<EditorToolbar editor={editor} />
				</div>
			)}

			{/* 2. ADAPTIVE FLOATING MENUS */}
			<FloatingToolbar editor={editor} />
			<TipTapFloatingMenu editor={editor} />

			{/* 3. MAIN CONTENT AREA 
                We allow the page to handle the scroll. This is much better for 
                mobile viewport height (dvh) and prevents the "stuck" feeling.
            */}
			<div className='relative w-full flex-1'>
				<EditorContent editor={editor} />
			</div>

			{/* 4. MOBILE TOOLBAR (Sticky at Bottom)
                This remains visible above the keyboard on most mobile browsers.
            */}
			{isMobile && (
				<div className='sticky bottom-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl rounded-t-xl overflow-hidden'>
					<EditorToolbar editor={editor} />
				</div>
			)}

			{/* 5. FOOTER STATUS BAR */}
			<div className='px-4 py-2 border-t bg-muted/20 flex justify-between items-center rounded-b-xl'>
				<div className='flex items-center gap-4'>
					<span className='text-[10px] text-muted-foreground uppercase font-bold tracking-tighter sm:tracking-widest'>
						Draft Mode
					</span>
					<Separator orientation='vertical' className='h-3' />
					<span className='text-[10px] text-muted-foreground'>
						{editor.storage.characterCount.words()} words
					</span>
				</div>

				{/* Visual indicator for "Saved" or "Syncing" */}
				<div className='flex items-center gap-1.5'>
					<div className='h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse' />
					<span className='text-[10px] text-muted-foreground font-medium'>
						Synced
					</span>
				</div>
			</div>
		</div>
	);
}
