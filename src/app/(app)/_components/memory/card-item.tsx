"use client";
import { DeleteIcon, EditIcon, MoreVerticalIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { MemoryCardDelete } from "./card-delete";

export function MemoryCard() {
	const [openDelete, setOpenDelete] = useState(false);

	return (
		<Card>
			<MemoryCardDelete
				title="Untitled"
				id="1"
				open={openDelete}
				onOpenChange={setOpenDelete}
			/>
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
					<DropdownMenuContent>
						<DropdownMenuItem>
							<EditIcon />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setOpenDelete(true)}>
							<DeleteIcon />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>

			<CardContent>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus,
				cumque facere officia, minima similique, neque eius sequi ipsum corporis
				odio consequuntur deserunt? Itaque corporis officiis blanditiis
				deserunt, nemo adipisci debitis.
			</CardContent>
		</Card>
	);
}
