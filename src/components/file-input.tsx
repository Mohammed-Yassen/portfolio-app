/** @format */
"use client";

import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

interface FileUploaderProps {
	onChange: (url: string) => void;
	endpoint: "primaryImage" | "secondaryImages";
	buttonLabel?: string;
	className?: string;
}

export function FileUploader({
	onChange,
	endpoint,
	buttonLabel,
	className,
}: FileUploaderProps) {
	const [isUploading, setIsUploading] = useState(false);

	return (
		<div className={cn("w-full", className)}>
			<UploadButton
				endpoint={endpoint}
				onUploadProgress={() => setIsUploading(true)}
				onClientUploadComplete={(res) => {
					setIsUploading(false);
					const url = res?.[0]?.url;
					if (url) {
						onChange(url);
						toast.success("Upload complete");
					}
				}}
				onUploadError={(error: Error) => {
					setIsUploading(false);
					toast.error(`Upload failed: ${error.message}`);
				}}
				content={{
					button: (
						<div className='flex items-center gap-2'>
							{isUploading ? (
								<Loader2 className='w-4 h-4 animate-spin' />
							) : (
								<Plus size={16} />
							)}
							<span>
								{isUploading ? "Uploading..." : buttonLabel || "Upload"}
							</span>
						</div>
					),
					allowedContent: null, // Removes the "Image (4MB)" text below button
				}}
				appearance={{
					container: "w-full",
					button: cn(
						"w-full h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
						"text-xs font-bold uppercase tracking-wider transition-all",
						"hover:opacity-90 active:scale-[0.98] ut-uploading:cursor-not-allowed",
					),
				}}
			/>
		</div>
	);
}
