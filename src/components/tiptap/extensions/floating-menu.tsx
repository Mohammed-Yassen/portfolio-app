/** @format */

"use client";

import {
	Heading1,
	Heading2,
	Heading3,
	ListOrdered,
	List,
	Code2,
	ChevronRight,
	Minus,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverAnchor,
} from "@/components/ui/popover";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/core";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandItemType {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	keywords: string;
	command: (editor: Editor) => void;
}

type CommandGroupType = {
	group: string;
	items: CommandItemType[];
};

const groups: CommandGroupType[] = [
	{
		group: "Basic blocks",
		items: [
			{
				title: "Text",
				description: "Just start writing with plain text",
				icon: ChevronRight,
				keywords: "paragraph text",
				command: (editor) => editor.chain().focus().setParagraph().run(),
			},
			{
				title: "Heading 1",
				description: "Large section heading",
				icon: Heading1,
				keywords: "h1 title header",
				command: (editor) =>
					editor.chain().focus().toggleHeading({ level: 1 }).run(),
			},
			{
				title: "Heading 2",
				description: "Medium section heading",
				icon: Heading2,
				keywords: "h2 subtitle",
				command: (editor) =>
					editor.chain().focus().toggleHeading({ level: 2 }).run(),
			},
			{
				title: "Bullet List",
				description: "Create a simple bullet list",
				icon: List,
				keywords: "unordered ul bullets",
				command: (editor) => editor.chain().focus().toggleBulletList().run(),
			},
			{
				title: "Horizontal Rule",
				description: "Add a horizontal divider",
				icon: Minus,
				keywords: "horizontal rule divider",
				command: (editor) => editor.chain().focus().setHorizontalRule().run(),
			},
		],
	},
	{
		group: "Alignment",
		items: [
			{
				title: "Align Left",
				description: "Align text to the left",
				icon: AlignLeft,
				keywords: "align left",
				command: (editor) => editor.chain().focus().setTextAlign("left").run(),
			},
			{
				title: "Align Center",
				description: "Center align text",
				icon: AlignCenter,
				keywords: "align center",
				command: (editor) =>
					editor.chain().focus().setTextAlign("center").run(),
			},
		],
	},
];

import { useMediaQuery } from "@/app/hooks/use-media-querry";

export function TipTapFloatingMenu({ editor }: { editor: Editor }) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (!editor) return;

		const updateHandler = () => {
			const { selection } = editor.state;
			const { $from } = selection;
			const currentLineText = $from.parent.textContent;
			const isSlash = currentLineText.startsWith("/");

			if (isSlash) {
				const query = currentLineText.slice(1);
				setSearch(query);

				try {
					const domPos = editor.view.coordsAtPos($from.pos);
					// Add scroll offset awareness
					setCoords({ top: domPos.top, left: domPos.left });
					setIsOpen(true);
				} catch (e) {
					setIsOpen(false);
				}
			} else {
				setIsOpen(false);
			}
		};

		editor.on("update", updateHandler);
		editor.on("selectionUpdate", updateHandler);
		return () => {
			editor.off("update", updateHandler);
			editor.off("selectionUpdate", updateHandler);
		};
	}, [editor]);

	const filteredGroups = useMemo(() => {
		return groups
			.map((group) => ({
				...group,
				items: group.items.filter(
					(item) =>
						item.title.toLowerCase().includes(search.toLowerCase()) ||
						item.keywords.toLowerCase().includes(search.toLowerCase()),
				),
			}))
			.filter((group) => group.items.length > 0);
	}, [search]);

	const executeCommand = useCallback(
		(commandFn: (editor: Editor) => void) => {
			if (!editor) return;

			const { from } = editor.state.selection;
			const deleteRange = search.length + 1; // +1 for the slash

			editor
				.chain()
				.focus()
				.deleteRange({ from: from - deleteRange, to: from })
				.run();

			commandFn(editor);
			setIsOpen(false);
		},
		[editor, search],
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverAnchor
				style={{
					position: "fixed",
					top: coords.top,
					left: coords.left,
				}}
			/>
			<PopoverContent
				side={isMobile ? "top" : "bottom"} // On mobile, pop UP so the keyboard doesn't hide it
				align='start'
				// Dynamic width: Full width minus padding on mobile
				className={cn(
					"p-0 border shadow-2xl z-[100] transition-all",
					isMobile ? "w-[calc(100vw-32px)] mx-4" : "w-72",
				)}
				onOpenAutoFocus={(e) => e.preventDefault()}>
				<Command className='rounded-lg bg-popover'>
					<ScrollArea className={cn(isMobile ? "max-h-60" : "max-h-80")}>
						<CommandList>
							<CommandEmpty>No results</CommandEmpty>
							{filteredGroups.map((group) => (
								<CommandGroup key={group.group} heading={group.group}>
									{group.items.map((item) => (
										<CommandItem
											key={item.title}
											onSelect={() => executeCommand(item.command)}
											className='flex items-center gap-3 py-3 px-4 sm:py-2'>
											<div className='bg-muted p-2 rounded-md'>
												<item.icon className='h-4 w-4 shrink-0' />
											</div>
											<div className='flex flex-col'>
												<span className='text-sm font-medium'>
													{item.title}
												</span>
												<span className='text-xs text-muted-foreground line-clamp-1'>
													{item.description}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							))}
						</CommandList>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
