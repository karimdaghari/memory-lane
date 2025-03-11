"use client";

import {
	DeleteIcon,
	EditIcon,
	MoreVerticalIcon,
	ShareIcon,
} from "@/components/icons";
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
import {
	Button,
	type ButtonProps,
	buttonVariants,
} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client/react";
import type { RouterOutputs } from "@/trpc/types";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "../copy-button";
import { MemoryCardEdit } from "./card-edit";

type Input =
	| RouterOutputs["memoryLanes"]["getById"]
	| RouterOutputs["memoryLanes"]["getAll"][number];

type MemoryCardItemProps = Input & {
	/**
	 * The location of the card
	 * @default "listing"
	 * @note This is used to determine the card's location and thus its design
	 */
	location?: "listing" | "page";
	/**
	 * Whether the current user is the owner of the memory lane
	 * @default true
	 * @note This is used to determine if the user can see the controls to edit the memory lane
	 */
	isOwner?: boolean;
};

export function MemoryCardItem({
	location = "listing",
	isOwner = true,
	...props
}: MemoryCardItemProps) {
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openShare, setOpenShare] = useState(false);

	const actions: {
		icon: React.ReactNode;
		label: string;
		onClick: () => void;
		variant: ButtonProps["variant"];
		disabled?: boolean;
	}[] = [
		{
			icon: <EditIcon />,
			label: "Edit",
			onClick: () => setOpenEdit(true),
			variant: "secondary",
		},
		{
			icon: <ShareIcon />,
			label: "Share",
			onClick: () => setOpenShare(true),
			variant: "default",
			disabled: props.visibility !== "public",
		},
		{
			icon: <DeleteIcon />,
			label: "Delete",
			onClick: () => setOpenDelete(true),
			variant: "destructive",
		},
	];

	return (
		<Card
			className={cn("rounded-lg", {
				"rounded-none p-0 border-none shadow-none flex flex-col justify-center items-center":
					location === "page",
			})}
		>
			<MemoryCardDelete
				title={props.title}
				id={props.id}
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>

			<MemoryCardEdit {...props} open={openEdit} onOpenChange={setOpenEdit} />

			{props.visibility === "public" && (
				<MemoryCardShare
					value={`${window.origin}/m/${props.id}`}
					open={openShare}
					onOpenChange={setOpenShare}
				/>
			)}

			{location === "listing" && (
				<CardHeader className="flex-row justify-between">
					<div className="w-4/5">
						<CardTitle className="truncate">{props.title}</CardTitle>
						<CardDescription>
							Created on {format(new Date(), "MMM d, yyyy")}
						</CardDescription>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreVerticalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{actions.map((action) => (
								<DropdownMenuItem
									key={action.label}
									onClick={action.onClick}
									variant={
										action.variant === "destructive" ? "destructive" : "default"
									}
									disabled={action.disabled}
								>
									{action.icon}
									{action.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</CardHeader>
			)}

			{location === "page" && (
				<CardHeader className="text-center">
					<CardTitle className="lg:text-4xl font-bold">{props.title}</CardTitle>
					<CardDescription>
						Created on {format(new Date(), "MMM d, yyyy")}
					</CardDescription>
				</CardHeader>
			)}

			<CardContent
				className={cn({
					"p-0 text-center max-w-2xl": location === "page",
				})}
			>
				<Typography>{props.description}</Typography>
			</CardContent>

			{isOwner ? (
				<CardFooter
					className={cn({
						"flex justify-center gap-2": location === "page",
					})}
				>
					{location === "page" ? (
						actions
							.filter((action) => !action.disabled)
							.map((action) => (
								<Button
									key={action.label}
									onClick={action.onClick}
									variant={action.variant}
									size="sm"
									disabled={action.disabled}
								>
									{action.icon}
									{action.label}
								</Button>
							))
					) : (
						<Link href={`/m/${props.id}`} className={buttonVariants()}>
							View
						</Link>
					)}
				</CardFooter>
			) : null}
		</Card>
	);
}

export function MemoryCardItemSkeletonListing() {
	return (
		<Card>
			<CardHeader className="flex-row justify-between">
				<div className="w-4/5">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-1/2 mt-2" />
				</div>
				<Skeleton className="size-10 rounded-md" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-20 w-full" />
			</CardContent>
		</Card>
	);
}

export function MemoryCardItemSkeletonPage() {
	return (
		<Card className="rounded-none p-0 border-none shadow-none">
			<CardHeader className="flex flex-col items-center justify-center w-full">
				<CardTitle>
					<Skeleton className="h-16 lg:w-96 w-62" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 lg:w-80 w-56" />
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="mx-auto max-w-2xl">
					<Skeleton className="h-20 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}

interface MemoryCardDeleteProps {
	title: string;
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function MemoryCardDelete({
	title,
	open,
	onOpenChange,
	id,
}: MemoryCardDeleteProps) {
	const router = useRouter();
	const trpc = useTRPC();

	const deleteMutation = useMutation(
		trpc.memoryLanes.delete.mutationOptions({
			onSuccess: () => {
				router.push("/");
			},
		}),
	);

	const deleteMemory = async () => {
		return toast.promise(deleteMutation.mutateAsync({ id }), {
			loading: "Deleting memory lane...",
			success: "Memory lane deleted",
			error: "Failed to delete memory lane",
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>You're about to delete {title}</AlertDialogTitle>
					<AlertDialogDescription>
						This action is irreversible. You will be deleting this memory lane
						along with all the memories it contains. Are you sure you want to
						proceed?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: "destructive" })}
						onClick={deleteMemory}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface MemoryCardShareProps {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	value: string;
}

function MemoryCardShare({
	children,
	open,
	onOpenChange,
	value,
}: MemoryCardShareProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share your memory</DialogTitle>
					<DialogDescription>
						Share your memory with your friends and family.
					</DialogDescription>
				</DialogHeader>

				<CopyButton value={value} />
			</DialogContent>
		</Dialog>
	);
}
