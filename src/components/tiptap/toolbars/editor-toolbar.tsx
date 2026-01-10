/** @format */

"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolbarProvider } from "./toolbar-provider";
import { Editor } from "@tiptap/core";

// Tool Components
import { UndoToolbar } from "./undo";
import { RedoToolbar } from "./redo";
import { HeadingsToolbar } from "./headings";
import { BlockquoteToolbar } from "./blockquote";
import { CodeToolbar } from "./code";
import { BoldToolbar } from "./bold";
import { ItalicToolbar } from "./italic";
import { UnderlineToolbar } from "./underline";
import { StrikeThroughToolbar } from "./strikethrough";
import { LinkToolbar } from "./link";
import { BulletListToolbar } from "./bullet-list";
import { OrderedListToolbar } from "./ordered-list";
import { HorizontalRuleToolbar } from "./horizontal-rule";
import { AlignmentTooolbar } from "./alignment";
import { ImagePlaceholderToolbar } from "./image-placeholder-toolbar";
import { ColorHighlightToolbar } from "./color-and-highlight";
import { SearchAndReplaceToolbar } from "./search-and-replace-toolbar";
import { CodeBlockToolbar } from "./code-block";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/app/hooks/use-media-querry";

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
	const isMobile = useMediaQuery("(max-width: 0px)");

	return (
		<div
			className={cn(
				"w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
				// Position logic: Mobile is pinned to bottom, Desktop is part of the editor flow
				isMobile ? "border-t pb-safe" : "border-b",
			)}>
			<ToolbarProvider editor={editor}>
				<TooltipProvider>
					{/* On Mobile: We use ScrollArea to allow horizontal swiping of tools.
              On Desktop: We allow wrapping so all tools are visible at once.
          */}
					<ScrollArea className={cn("w-full", !isMobile && "overflow-visible")}>
						<div
							className={cn(
								"flex items-center gap-1 p-1.5",
								isMobile ? "flex-nowrap min-w-max" : "flex-wrap justify-start",
							)}>
							{/* Group 1: History */}
							<div className='flex items-center bg-muted/20 rounded-md p-0.5'>
								<UndoToolbar />
								<RedoToolbar />
							</div>

							<Separator
								orientation='vertical'
								className='mx-1 h-6 hidden sm:block'
							/>

							{/* Group 2: Structure */}
							<div className='flex items-center gap-0.5'>
								<HeadingsToolbar />
								<BlockquoteToolbar />
								<CodeToolbar />
								<CodeBlockToolbar />
							</div>

							<Separator
								orientation='vertical'
								className='mx-1 h-6 hidden sm:block'
							/>

							{/* Group 3: Formatting */}
							<div className='flex items-center gap-0.5'>
								<BoldToolbar />
								<ItalicToolbar />
								<UnderlineToolbar />
								<StrikeThroughToolbar />
								<LinkToolbar />
							</div>

							<Separator
								orientation='vertical'
								className='mx-1 h-6 hidden sm:block'
							/>

							{/* Group 4: Lists & Rules */}
							<div className='flex items-center gap-0.5'>
								<BulletListToolbar />
								<OrderedListToolbar />
								<HorizontalRuleToolbar />
							</div>

							<Separator
								orientation='vertical'
								className='mx-1 h-6 hidden sm:block'
							/>

							{/* Group 5: Advanced & Media */}
							<div className='flex items-center gap-0.5'>
								<AlignmentTooolbar />
								<ImagePlaceholderToolbar />
								<ColorHighlightToolbar />
							</div>

							{/* Push Search to the end on wide screens */}
							<div className='flex-1 min-w-[10px] hidden lg:block' />

							{/* Group 6: Search Utilities */}
							<div
								className={cn(
									"flex items-center pr-2 ml-auto",
									isMobile && "sticky right-0 bg-background/95 pl-2 border-l",
								)}>
								<SearchAndReplaceToolbar />
							</div>
						</div>

						<ScrollBar
							orientation='horizontal'
							className={cn(!isMobile && "hidden")}
						/>
					</ScrollArea>
				</TooltipProvider>
			</ToolbarProvider>
		</div>
	);
};
