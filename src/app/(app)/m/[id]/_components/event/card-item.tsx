"use client";

import { DeleteIcon, EditIcon } from "@/components/icons";
import { Typography } from "@/components/typography";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client/react";
import type { RouterOutputs } from "@/trpc/types";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";
import { EventCardEdit } from "./card-edit";

type Input = RouterOutputs["events"]["getAll"]["events"][number];

interface EventCardProps extends Input {
	isOwner: boolean;
}

export function EventCard({ isOwner, ...props }: EventCardProps) {
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const actions: {
		icon: React.ReactNode;
		label: string;
		onClick: () => void;
		variant: ButtonProps["variant"];
	}[] = [
		{
			icon: <EditIcon />,
			label: "Edit",
			onClick: () => setOpenEdit(true),
			variant: "secondary",
		},
		{
			icon: <DeleteIcon />,
			label: "Delete",
			onClick: () => setOpenDelete(true),
			variant: "destructive",
		},
	];

	return (
		<Card className="rounded-lg">
			<EventCardDelete
				title={props.title}
				id={props.id}
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>
			<EventCardEdit {...props} open={openEdit} onOpenChange={setOpenEdit} />
			<CardHeader>
				<img
					src={props.image}
					className="h-48 w-full object-cover"
					alt={props.title}
				/>
			</CardHeader>

			<CardContent>
				<CardTitle className="truncate">{props.title}</CardTitle>
				<CardDescription>
					{dayjs(props.date).format("MMM d, YYYY")}
				</CardDescription>

				<Typography>{props.description}</Typography>
			</CardContent>

			{isOwner && (
				<CardFooter className="flex-row gap-2">
					{actions.map((action) => (
						<Button
							key={action.label}
							onClick={action.onClick}
							variant={action.variant}
							size="sm"
						>
							{action.icon}
							{action.label}
						</Button>
					))}
				</CardFooter>
			)}
		</Card>
	);
}

export function EventCardLoading() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="w-full aspect-[2/1] rounded-lg" />
			</CardHeader>
			<CardContent className="space-y-2">
				<CardTitle>
					<Skeleton className="h-6 w-3/4" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 w-1/3" />
				</CardDescription>
				<Skeleton className="h-20 w-full" />
			</CardContent>
		</Card>
	);
}

interface EventCardDeleteProps {
	title: string;
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function EventCardDelete({
	title,
	open,
	onOpenChange,
	id,
}: EventCardDeleteProps) {
	const trpc = useTRPC();

	const deleteMutation = useMutation(trpc.events.delete.mutationOptions());

	const deleteEvent = async () => {
		return toast.promise(deleteMutation.mutateAsync({ id }), {
			loading: "Deleting event...",
			success: "Event deleted",
			error: "Failed to delete event",
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>You're about to delete {title}</AlertDialogTitle>
					<AlertDialogDescription>
						This action is irreversible. You will be deleting this event along
						with the attached image.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: "destructive" })}
						onClick={deleteEvent}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
