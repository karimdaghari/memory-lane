"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/forms";
import { MemoryLanesInsertSchema } from "@/shared/schemas";
import { useTRPC } from "@/trpc/client/react";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	getMemoryLaneVisibilityIcon,
	getMemoryLaneVisibilityLabel,
} from "./lib";

export interface Props extends Partial<MemoryLanesInsertSchema> {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function MemoryCardEdit({
	children,
	open = false,
	onOpenChange,
	...input
}: Props) {
	const trpc = useTRPC();

	const router = useRouter();

	const [_open, setOpen] = useState(open);

	useEffect(() => {
		setOpen(open);
	}, [open]);

	function handleOpenChange(open: boolean) {
		setOpen(open);
		onOpenChange?.(open);
	}

	const createMutation = useMutation(
		trpc.memoryLanes.create.mutationOptions({
			onSuccess: ({ id }) => {
				toast.success("Memory lane updated");
				handleOpenChange(false);
				router.push(`/m/${id}`);
			},
			onError: () => {
				toast.error("Failed to update memory lane");
			},
		}),
	);

	const updateMutation = useMutation(
		trpc.memoryLanes.update.mutationOptions({
			onSuccess: () => {
				toast.success("Memory lane updated");
				handleOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to update memory lane");
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {
			...input,
			title: input.title ?? "Untitled",
			visibility: input.visibility ?? "private",
		} as MemoryLanesInsertSchema,
		validators: {
			onSubmit: MemoryLanesInsertSchema,
		},
		onSubmit: async ({ value }) => {
			if (value.id)
				return await updateMutation.mutateAsync({ id: value.id, ...value });

			return await createMutation.mutateAsync(value);
		},
	});

	const title = useStore(form.store, (state) => state.values.title);
	const id = useStore(form.store, (state) => state.values.id);

	return (
		<form.AppForm>
			<Dialog open={_open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							{id ? "Edit Memory Lane" : "Create Memory Lane"}
						</DialogDescription>
					</DialogHeader>

					<form
						id="lane-card-form"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.AppField
							name="title"
							children={(field) => (
								<field.TextField
									label="Title"
									placeholder="Memory Lane Title"
								/>
							)}
						/>
						<form.AppField
							name="description"
							children={(field) => (
								<field.TextareaField
									label="Description"
									placeholder="Memory Lane Description"
								/>
							)}
						/>
						<form.AppField
							name="visibility"
							children={(field) => (
								<field.TabsField
									label="Visibility"
									values={[
										{
											value: "public",
											label: getMemoryLaneVisibilityLabel("public"),
											icon: getMemoryLaneVisibilityIcon("public"),
										},
										{
											value: "private",
											label: getMemoryLaneVisibilityLabel("private"),
											icon: getMemoryLaneVisibilityIcon("private"),
										},
									]}
									description="When the visibility is set to public, you will be able to share the memory lane with others."
								/>
							)}
						/>
					</form>

					<DialogFooter className="flex justify-end">
						<form.SubmitButton form="lane-card-form">
							{input.id ? "Update" : "Create"}
						</form.SubmitButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</form.AppForm>
	);
}
