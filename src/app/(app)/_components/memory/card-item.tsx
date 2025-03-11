"use client";
import {
	DeleteIcon,
	EditIcon,
	MoreVerticalIcon,
	ShareIcon,
} from "@/components/icons";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { MemoryCardDelete } from "./card-delete";
import { MemoryCardEdit } from "./card-edit";
import { MemoryCardShare } from "./card-share";
interface Props {
	/**
	 * The location of the card
	 * @default "listing"
	 * @note This is used to determine the card's location and thus its design
	 */
	location?: "listing" | "page";
}

export function MemoryCard({ location = "listing" }: Props) {
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openShare, setOpenShare] = useState(false);

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
			icon: <ShareIcon />,
			label: "Share",
			onClick: () => setOpenShare(true),
			variant: "default",
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
				title="Untitled"
				id="1"
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>
			<MemoryCardEdit
				title="Untitled"
				id="1"
				open={openEdit}
				onOpenChange={setOpenEdit}
			/>
			<MemoryCardShare
				value="https://www.google.com"
				open={openShare}
				onOpenChange={setOpenShare}
			/>
			{location === "listing" && (
				<CardHeader className="flex-row justify-between">
					<div className="w-4/5">
						<CardTitle className="truncate">Untitled</CardTitle>
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
					<CardTitle className="lg:text-4xl font-bold">Untitled</CardTitle>
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
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus,
				cumque facere officia, minima similique, neque eius sequi ipsum corporis
				odio consequuntur deserunt? Itaque corporis officiis blanditiis
				deserunt, nemo adipisci debitis.
			</CardContent>

			<CardFooter
				className={cn({
					"flex justify-center gap-2": location === "page",
				})}
			>
				{location === "page" ? (
					actions.map((action) => (
						<Button
							key={action.label}
							onClick={action.onClick}
							variant={action.variant}
							size="sm"
						>
							{action.icon}
							{action.label}
						</Button>
					))
				) : (
					<Link href="/m/1" className={buttonVariants()}>
						View
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
