"use client";
import { DeleteIcon, EditIcon } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { EventCardDelete } from "./card-delete";
import { EventCardEdit } from "./card-edit";

export function EventCard() {
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
		<Card className={cn("rounded-lg")}>
			<EventCardDelete
				title="Untitled"
				id="1"
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>
			<EventCardEdit
				title="Untitled"
				date={new Date()}
				laneId="1"
				id="1"
				open={openEdit}
				onOpenChange={setOpenEdit}
			/>
			<CardHeader>
				<img
					src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="placeholder"
					height={500}
					className="rounded-lg"
				/>
			</CardHeader>

			<CardContent>
				<CardTitle className="truncate">Untitled</CardTitle>
				<CardDescription>{format(new Date(), "MMM d, yyyy")}</CardDescription>

				<Typography>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus,
					cumque facere officia, minima similique, neque eius sequi ipsum
					corporis odio consequuntur deserunt? Itaque corporis officiis
					blanditiis deserunt, nemo adipisci debitis.
				</Typography>
			</CardContent>

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
		</Card>
	);
}
