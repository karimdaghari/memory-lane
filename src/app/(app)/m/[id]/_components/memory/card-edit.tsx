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
import { MemoriesInsertSchema } from "@/shared/schemas";
import { useTRPC } from "@/trpc/client/react";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

interface Props extends Partial<MemoriesInsertSchema> {
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

	const [_open, setOpen] = useState(open);

	useEffect(() => {
		setOpen(open);
	}, [open]);

	function handleOpenChange(open: boolean) {
		setOpen(open);
		onOpenChange?.(open);
	}

	const createMutation = useMutation(
		trpc.memories.create.mutationOptions({
			onSuccess: () => {
				handleOpenChange(false);
				toast.success("Memory created");
			},
			onError: () => {
				toast.error("Failed to create memory");
			},
		}),
	);

	const updateMutation = useMutation(
		trpc.memories.update.mutationOptions({
			onSuccess: () => {
				handleOpenChange(false);
				toast.success("Memory updated");
			},
			onError: () => {
				toast.error("Failed to update memory");
			},
		}),
	);

	const form = useAppForm({
		defaultValues: {
			...input,
			title: input.title ?? "Untitled",
		} as MemoriesInsertSchema,
		validators: {
			onSubmit: MemoriesInsertSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			if (value.id) {
				return await updateMutation.mutateAsync(
					{ id: value.id, ...value },
					{
						onSuccess: () => {
							formApi.reset();
						},
					},
				);
			}

			return await createMutation.mutateAsync(value, {
				onSuccess: () => {
					formApi.reset();
				},
			});
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
						<DialogTitle>{title || "Untitled"}</DialogTitle>
						<DialogDescription>
							{id ? "Edit memory" : "Create memory"}
						</DialogDescription>
					</DialogHeader>

					<form
						id="event-card-form"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.AppField
							name="image"
							children={(field) => <field.UploaderField label="Image" />}
						/>
						<form.AppField
							name="date"
							children={(field) => <field.DateField label="Date" />}
						/>
						<form.AppField
							name="title"
							children={(field) => (
								<field.TextField label="Title" placeholder="Memory Title" />
							)}
						/>
						<form.AppField
							name="description"
							children={(field) => (
								<field.TextareaField
									label="Description"
									placeholder="Memory Description"
								/>
							)}
						/>
					</form>

					<DialogFooter className="flex justify-end">
						<form.SubmitButton form="event-card-form">
							{id ? "Update memory" : "Create memory"}
						</form.SubmitButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</form.AppForm>
	);
}
