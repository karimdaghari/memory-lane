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
import { MemoryLanesInsertSchema } from "@/shared/schemas/memory-lanes-input";
import { useStore } from "@tanstack/react-form";
import {
	getMemoryLaneVisibilityIcon,
	getMemoryLaneVisibilityLabel,
} from "./lib";

interface Props extends MemoryLanesInsertSchema {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function MemoryCardEdit({
	children,
	open,
	onOpenChange,
	...input
}: Props) {
	const form = useAppForm({
		defaultValues: {
			...input,
			title: input.title,
			visibility: input.visibility ?? "private",
		} as MemoryLanesInsertSchema,
		validators: {
			onSubmit: MemoryLanesInsertSchema,
		},
	});

	const title = useStore(form.store, (state) => state.values.title);
	const id = useStore(form.store, (state) => state.values.id);

	return (
		<form.AppForm>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title || "Untitled"}</DialogTitle>
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
