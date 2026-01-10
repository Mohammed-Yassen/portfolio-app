/** @format */
"use client";

import { useState, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
	ShieldCheck,
	Languages,
	Pencil,
	Plus,
	Save,
	Loader2,
	X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	certificationSchema,
	type CertificationFormValue,
} from "@/server/validations";
import { Locale } from "@prisma/client";
import { TransformedCertification } from "@/types";
import {
	deleteCertificationAction,
	upsertCertificationAction,
} from "@/server/actions/setting";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { FormFieldWrapper } from "@/components/input-form-wrapper";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
	initialData: TransformedCertification[];
	locale: Locale;
}

const EMPTY_VALUES: CertificationFormValue = {
	issuer: "",
	issueDate: new Date().toISOString().split("T")[0],
	isActive: true,
	locale: "en",

	title: "",
	id: undefined,
	coverUrl: undefined,
	link: undefined,
	expireDate: null,
	credentialUrl: "",
	credentialId: "",
	description: "",
};

export function CertificationForm({ initialData, locale }: Props) {
	const [isPending, startTransition] = useTransition();
	const [editingId, setEditingId] = useState<string | null>(null);
	const t = useTranslations("certificationForm");

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isRtl = locale === "ar";

	const form = useForm<CertificationFormValue>({
		resolver: zodResolver(certificationSchema),
		defaultValues: { ...EMPTY_VALUES, locale },
	});

	const onEdit = (cert: TransformedCertification) => {
		setEditingId(cert.id);

		// Defensive helper
		const nullToV = <T,>(v: T | null): T | undefined =>
			v === null ? undefined : v;

		// Use the component-level locale prop explicitly
		const currentLocale = locale as Locale;

		form.reset({
			id: cert.id,
			issuer: cert.issuer,
			title: cert.title,
			isActive: cert.isActive,
			locale: currentLocale, // Reference the stabilized variable
			link: nullToV(cert.link),
			coverUrl: nullToV(cert.coverUrl),
			credentialUrl: nullToV(cert.credentialUrl),
			credentialId: nullToV(cert.credentialId),
			issueDate: cert.issueDate
				? new Date(cert.issueDate).toISOString().split("T")[0]
				: new Date().toISOString().split("T")[0],
			expireDate: cert.expireDate
				? new Date(cert.expireDate).toISOString().split("T")[0]
				: null,
		});
	};
	const onCancel = () => {
		setEditingId(null);
		form.reset({ ...EMPTY_VALUES, locale });
	};

	const onSubmit = async (values: CertificationFormValue) => {
		startTransition(async () => {
			const result = await upsertCertificationAction(values);
			if (result.success) {
				toast.success(editingId ? t("successUpdate") : t("successCreate"));
				onCancel();
				router.refresh();
			} else {
				toast.error(result.error);
			}
		});
	};

	const onLanguageChange = (newLocale: string) => {
		const params = new URLSearchParams(searchParams);
		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(`${newPath}?${params.toString()}`);
	};

	return (
		<div
			dir={isRtl ? "rtl" : "ltr"}
			className='space-y-6 max-w-7xl mx-auto p-4'>
			<header className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card rounded-3xl border shadow-sm'>
				<div className='flex items-center gap-4'>
					<div className='p-3 bg-primary/10 rounded-xl text-primary'>
						<ShieldCheck size={24} />
					</div>
					<div>
						<h1 className='text-xl font-bold'>{t("title")}</h1>
						<p className='text-sm text-muted-foreground'>{t("subtitle")}</p>
					</div>
				</div>
				<Select onValueChange={onLanguageChange} value={locale}>
					<SelectTrigger className='w-40 rounded-xl h-11'>
						<Languages className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='en'>English</SelectItem>
						<SelectItem value='ar'>العربية</SelectItem>
					</SelectContent>
				</Select>
			</header>

			<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
				<section className='lg:col-span-7'>
					<Card className='rounded-3xl border-primary/10'>
						<CardHeader className='border-b bg-muted/5'>
							<CardTitle className='text-lg flex items-center gap-2'>
								{editingId ? <Pencil size={18} /> : <Plus size={18} />}
								{editingId ? t("editTitle") : t("addTitle")}
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='title'
											label={t("certName")}>
											{(field) => (
												<Input placeholder={t("certPlaceholder")} {...field} />
											)}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='issuer'
											label={t("issuer")}>
											{(field) => (
												<Input
													placeholder={t("issuerPlaceholder")}
													{...field}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='issueDate'
											label={t("issueDate")}>
											{(field) => <Input type='date' {...field} />}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='expireDate'
											label={t("expireDate")}>
											{(field) => (
												<Input
													type='date'
													value={field.value || ""}
													onChange={(e) =>
														field.onChange(e.target.value || null)
													}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormFieldWrapper
											control={form.control}
											name='credentialId'
											label={t("credentialId")}>
											{(field) => (
												<Input
													placeholder={t("credentialIdPlaceholder")}
													{...field}
													value={field.value || ""}
												/>
											)}
										</FormFieldWrapper>
										<FormFieldWrapper
											control={form.control}
											name='credentialUrl'
											label={t("credentialUrl")}>
											{(field) => (
												<Input
													type='url'
													placeholder={t("urlPlaceholder")}
													{...field}
													value={field.value || ""}
												/>
											)}
										</FormFieldWrapper>
									</div>

									<VisualAssetsSection form={form} t={t} />

									<div className='flex gap-3'>
										<Button
											disabled={isPending}
											type='submit'
											className='flex-1 rounded-xl h-12'>
											{isPending ? (
												<Loader2 className='animate-spin mr-2' />
											) : (
												<Save className={cn(isRtl ? "ml-2" : "mr-2")} />
											)}
											{editingId ? t("update") : t("save")}
										</Button>
										{editingId && (
											<Button
												type='button'
												variant='outline'
												onClick={onCancel}
												className='rounded-xl h-12'>
												{t("cancel")}
											</Button>
										)}
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</section>

				<section className='lg:col-span-5'>
					<ScrollArea className='h-[600px]'>
						<div className='space-y-4'>
							{initialData.length === 0 ? (
								<div className='p-12 border-2 border-dashed rounded-3xl text-center text-muted-foreground'>
									<p>{t("noData")}</p>
								</div>
							) : (
								initialData.map((cert) => (
									<CertificationCard
										key={cert.id}
										cert={cert}
										t={t}
										onEdit={() => onEdit(cert)}
									/>
								))
							)}
						</div>
					</ScrollArea>
				</section>
			</div>
		</div>
	);
}

function VisualAssetsSection({
	form,
	t,
}: {
	form: UseFormReturn<CertificationFormValue>;
	t: ReturnType<typeof useTranslations>;
}) {
	const [uploading, setUploading] = useState(false);
	const imageUrl = form.watch("coverUrl");

	return (
		<div className='bg-muted/30 rounded-3xl p-4 border space-y-3'>
			<h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
				{t("assetTitle")}
			</h3>
			<FormFieldWrapper control={form.control} name='coverUrl' label=''>
				{(field) => (
					<div
						className={cn(
							"relative flex flex-col items-center justify-center min-h-[180px] rounded-2xl border-2 border-dashed transition-all",
							uploading
								? "border-primary animate-pulse"
								: "border-muted-foreground/20",
						)}>
						{imageUrl ? (
							<div className='relative group'>
								<Image
									src={imageUrl}
									alt='Preview'
									width={120}
									height={120}
									className='rounded-xl object-cover'
								/>
								<button
									type='button'
									onClick={() => field.onChange("")}
									className='absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full'>
									<X size={14} />
								</button>
							</div>
						) : (
							<UploadButton
								endpoint='primaryImage'
								onUploadProgress={() => setUploading(true)}
								onClientUploadComplete={(res) => {
									field.onChange(res?.[0]?.url);
									setUploading(false);
								}}
								content={{
									button: uploading ? t("uploading") : t("uploadBtn"),
								}}
								appearance={{
									button:
										"bg-primary text-primary-foreground rounded-lg text-sm px-6",
								}}
							/>
						)}
					</div>
				)}
			</FormFieldWrapper>
		</div>
	);
}

function CertificationCard({
	cert,
	t,
	onEdit,
}: {
	cert: TransformedCertification;
	t: ReturnType<typeof useTranslations>;
	onEdit: () => void;
}) {
	return (
		<Card
			className='p-4 hover:border-primary/50 transition-colors cursor-pointer group'
			onClick={onEdit}>
			<div className='flex justify-between items-start'>
				<div>
					<h4 className='font-bold'>{cert.title}</h4>
					<p className='text-sm text-muted-foreground'>{cert.issuer}</p>
					<p className='text-[10px] mt-2 text-muted-foreground/60'>
						{t("issuedOn")} {new Date(cert.issueDate).toLocaleDateString()}
					</p>
				</div>
				<Pencil size={14} className='opacity-0 group-hover:opacity-100' />
			</div>
		</Card>
	);
}
