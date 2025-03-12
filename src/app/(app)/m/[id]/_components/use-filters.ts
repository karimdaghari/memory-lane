import { useQueryStates } from "nuqs";
import { memoriesFiltersParams } from "../search-params";

export function useMemoriesFilters() {
	const [filters, setFilters] = useQueryStates(memoriesFiltersParams);

	return { filters, setFilters };
}
