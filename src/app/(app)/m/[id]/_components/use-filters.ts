import { useQueryStates } from "nuqs";
import { eventsFiltersParams } from "../search-params";

export function useEventsFilters() {
	const [filters, setFilters] = useQueryStates(eventsFiltersParams);

	return { filters, setFilters };
}
