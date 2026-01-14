/** @format */
"use client";

import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Plus, Trash2, Save, Globe, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/server/actions/user";
import { ProfileFormValues, ProfileSchema } from "@/server/validations/user";
import { UserWithProfile } from "@/types/user";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserRole } from "@prisma/client";

interface ProfileFormProps {
	initialData: UserWithProfile;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
	// Senior Approach: Robust default value mapping
	const defaultTranslation = initialData.profile?.translations?.[0];

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(ProfileSchema) as never,
		defaultValues: {
			name: initialData.name ?? "",
			phone: initialData?.profile?.phone ?? "",
			role: initialData.role as UserRole,
			image: initialData.image ?? "",
			professionalEmail: initialData.profile?.professionalEmail ?? "",
			resumeUrl: initialData.profile?.resumeUrl ?? "",
			location: defaultTranslation?.location ?? "",
			bio: defaultTranslation?.bio ?? "",
			socials:
				initialData?.profile?.socials?.map((s) => ({
					name: s.name ?? "",
					url: s.url ?? "",
					icon: s.icon ?? "",
				})) ?? [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "socials",
	});

	async function onSubmit(values: ProfileFormValues) {
		try {
			const res = await updateProfile(values);
			if (res.success) toast.success(res.success);
			if (res.error) toast.error(res.error);
		} catch (error) {
			toast.error("An unexpected error occurred.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 max-w-5xl mx-auto pb-10'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column: Core Data */}
					<div className='lg:col-span-2 space-y-6'>
						<Card className='border shadow-sm bg-card'>
							<CardHeader>
								<CardTitle className='text-xl'>Core Identity</CardTitle>
								<CardDescription>
									Update your public-facing information and contact details.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-5'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='name'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full Name</FormLabel>
												<FormControl>
													<Input placeholder='e.g. John Doe' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='professionalEmail'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Public Email</FormLabel>
												<FormControl>
													<Input placeholder='contact@domain.com' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='phone'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input
														placeholder='+967...'
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='location'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Location</FormLabel>
												<FormControl>
													<Input
														placeholder='City, Country'
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='bio'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Bio</FormLabel>
												<FormControl>
													<Input
														placeholder='Enter your bio here'
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Social Links Section */}
						<Card className='border shadow-sm'>
							<CardHeader className='flex flex-row items-center justify-between'>
								<div>
									<CardTitle className='text-xl'>Social Presence</CardTitle>
									<CardDescription>
										Manage your external portfolio and social links.
									</CardDescription>
								</div>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => append({ name: "", url: "", icon: "" })}>
									<Plus className='h-4 w-4 mr-2' /> Add Link
								</Button>
							</CardHeader>
							<CardContent className='space-y-4 pt-4'>
								{fields.map((field, index) => (
									<div
										key={field.id}
										className='flex gap-3 items-end animate-in fade-in slide-in-from-left-2'>
										<div className='grid grid-cols-2 gap-3 flex-1'>
											<FormField
												control={form.control}
												name={`socials.${index}.name`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																placeholder='Platform (e.g. LinkedIn)'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`socials.${index}.url`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input placeholder='https://...' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<Button
											variant='ghost'
											size='icon'
											className='text-muted-foreground hover:text-destructive'
											onClick={() => remove(index)}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								))}
								{fields.length === 0 && (
									<div className='text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20'>
										No social links added.
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Right Column: Visuals */}
					<div className='space-y-6'>
						<VisualAssetsSection form={form} />

						<div className='flex flex-col gap-4 bg-card p-6 rounded-xl border shadow-sm'>
							<div className='flex justify-between items-center border-b pb-4'>
								<span className='text-sm font-medium'>Status</span>
								<span className='text-xs text-muted-foreground italic'>
									Last sync:{" "}
									{new Date(initialData.updatedAt).toLocaleDateString()}
								</span>
							</div>
							<Button
								type='submit'
								disabled={form.formState.isSubmitting}
								className='w-full'>
								{form.formState.isSubmitting ? (
									"Saving..."
								) : (
									<>
										<Save className='mr-2 h-4 w-4' /> Save Profile
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}

function VisualAssetsSection({
	form,
}: {
	form: UseFormReturn<ProfileFormValues>;
}) {
	const [uploading, setUploading] = useState(false);
	const imageUrl = form.watch("image");

	return (
		<Card className='border shadow-sm overflow-hidden'>
			<CardHeader className='bg-muted/30'>
				<CardTitle className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
					Profile Avatar
				</CardTitle>
			</CardHeader>
			<CardContent className='p-6'>
				<div
					className={cn(
						"relative flex flex-col items-center justify-center min-h-50 rounded-2xl border-2 border-dashed transition-all",
						uploading
							? "border-primary animate-pulse bg-primary/5"
							: "border-muted hover:border-primary/50",
					)}>
					{imageUrl ? (
						<div className='relative p-2'>
							<Image
								src={imageUrl}
								alt='Avatar Preview'
								width={1600}
								height={1600}
								unoptimized // <--- Add this!
								priority
								className='w-32 h-32 object-cover rounded-full shadow-md border-4 border-background'
							/>
							<button
								type='button'
								onClick={() => form.setValue("image", "")}
								className='absolute top-0 right-0 p-1.5 bg-destructive text-white rounded-full shadow-lg hover:scale-110 transition-transform'>
								<X size={14} />
							</button>
						</div>
					) : (
						<div className='flex flex-col items-center gap-3'>
							<div className='p-4 rounded-full bg-muted'>
								<Upload className='text-muted-foreground' size={24} />
							</div>
							<UploadButton
								endpoint='primaryImage' // Match your uploadthing endpoint
								onUploadProgress={() => setUploading(true)}
								onClientUploadComplete={(res) => {
									form.setValue("image", res?.[0]?.url ?? "");
									setUploading(false);
									toast.success("Upload successful");
								}}
								onUploadError={() => {
									setUploading(false);
									toast.error("Upload failed");
								}}
								content={{
									button: uploading ? "Processing..." : "Upload Photo",
								}}
								appearance={{
									button:
										"bg-primary text-primary-foreground text-xs h-9 px-4 rounded-md",
									allowedContent: "hidden",
								}}
							/>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
