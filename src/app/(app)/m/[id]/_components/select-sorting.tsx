"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SortAscIcon, SortDescIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { SortOptions, sortingSearchParams } from "../search-params";

export function SelectSorting() {
	const [{ sort }, setSort] = useQueryStates(sortingSearchParams);

	const options = SortOptions.map((value) => ({
		icon: value === "desc" ? SortDescIcon : SortAscIcon,
		label: value === "desc" ? "Newest to oldest" : "Oldest to newest",
		value,
	}));

	return (
		<Select
			value={sort}
			onValueChange={(value) => setSort({ sort: value as typeof sort })}
		>
			<SelectTrigger className="w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<option.icon className="size-4 mr-2" />
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
