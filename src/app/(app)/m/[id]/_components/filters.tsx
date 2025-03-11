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
import { SortOptions, eventsFiltersParams } from "../search-params";

export const useEventsFilters = () => {
	const [filters, setFilters] = useQueryStates(eventsFiltersParams);

	return { filters, setFilters };
};

export function EventsFilters() {
	const { filters, setFilters } = useEventsFilters();

	const options = SortOptions.map((value) => ({
		icon: value === "desc" ? SortDescIcon : SortAscIcon,
		label: value === "desc" ? "Newest to oldest" : "Oldest to newest",
		value,
	}));

	return (
		<Select
			value={filters.sort}
			onValueChange={(value) =>
				setFilters({ sort: value as typeof filters.sort })
			}
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
