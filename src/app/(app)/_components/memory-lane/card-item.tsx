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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client/react";
import type { RouterOutputs } from "@/trpc/types";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "../copy-button";
import { MemoryLaneCardEdit } from "./card-edit";
import {
	type Visibility,
	getMemoryLaneVisibilityIcon,
	getMemoryLaneVisibilityLabel,
} from "./lib";

type Input =
	| RouterOutputs["memoryLanes"]["getById"]
	| RouterOutputs["memoryLanes"]["getAll"][number];

type MemoryLaneCardItemProps = Input & {
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

export function MemoryLaneCardItem({
	location = "listing",
	isOwner = true,
	...props
}: MemoryLaneCardItemProps) {
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
			<MemoryLaneCardDelete
				title={props.title}
				id={props.id}
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>

			<MemoryLaneCardEdit
				{...props}
				open={openEdit}
				onOpenChange={setOpenEdit}
			/>

			{props.visibility === "public" && (
				<MemoryLaneCardShare
					value={`${window.origin}/m/${props.id}`}
					open={openShare}
					onOpenChange={setOpenShare}
				/>
			)}

			{location === "listing" && (
				<CardHeader className="flex-row justify-between">
					<div className="w-4/5">
						<CardTitle className="flex items-center gap-1 [&_svg]:size-4">
							<span className="truncate">{props.title}</span>
							<VisibilityIndicator visibility={props.visibility} />
						</CardTitle>
						<CardDescription>
							Created on {dayjs(props.createdAt).format("MMM D, YYYY")}
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
					<CardTitle className="lg:text-4xl font-bold flex items-center gap-1 justify-center">
						<span>{props.title}</span>
						<VisibilityIndicator visibility={props.visibility} />
					</CardTitle>
					<CardDescription>
						Created on {dayjs(props.createdAt).format("MMM D, YYYY")}
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

function VisibilityIndicator({ visibility }: { visibility: Visibility }) {
	const icon = getMemoryLaneVisibilityIcon(visibility);
	const label = getMemoryLaneVisibilityLabel(visibility);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span>{icon}</span>
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function MemoryLaneCardItemSkeletonListing() {
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

export function MemoryLaneCardItemSkeletonPage() {
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

interface MemoryLaneCardDeleteProps {
	title: string;
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function MemoryLaneCardDelete({
	title,
	open,
	onOpenChange,
	id,
}: MemoryLaneCardDeleteProps) {
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

interface MemoryLaneCardShareProps {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	value: string;
}

function MemoryLaneCardShare({
	children,
	open,
	onOpenChange,
	value,
}: MemoryLaneCardShareProps) {
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
