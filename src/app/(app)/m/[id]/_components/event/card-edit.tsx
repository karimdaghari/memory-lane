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
import { EventsInsertSchema } from "@/shared/schemas/events-input";
import { useTRPC } from "@/trpc/client/react";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
interface Props extends Partial<EventsInsertSchema> {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function EventCardEdit({
	children,
	open,
	onOpenChange,
	...input
}: Props) {
	const trpc = useTRPC();

	const createMutation = useMutation(trpc.events.create.mutationOptions());

	const updateMutation = useMutation(trpc.events.update.mutationOptions());

	const form = useAppForm({
		defaultValues: {
			...input,
			title: input.title ?? "Untitled",
		} as EventsInsertSchema,
		validators: {
			onSubmit: EventsInsertSchema,
		},
		onSubmit: async ({ value }) => {
			if (value.id) {
				return toast.promise(
					updateMutation.mutateAsync({ id: value.id, ...value }),
					{
						loading: "Updating event...",
						success: "Event updated",
						error: "Failed to update event",
					},
				);
			}

			return toast.promise(createMutation.mutateAsync(value), {
				loading: "Creating event...",
				success: "Event created",
				error: "Failed to create event",
			});
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
							{id ? "Edit Event" : "Create Event"}
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
							name="title"
							children={(field) => (
								<field.TextField label="Title" placeholder="Event Title" />
							)}
						/>
						<form.AppField
							name="description"
							children={(field) => (
								<field.TextareaField
									label="Description"
									placeholder="Event Description"
								/>
							)}
						/>
					</form>

					<DialogFooter className="flex justify-end">
						<form.SubmitButton form="event-card-form">
							{id ? "Update" : "Create"}
						</form.SubmitButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</form.AppForm>
	);
}
