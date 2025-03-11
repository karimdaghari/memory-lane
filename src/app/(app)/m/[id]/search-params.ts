import type { RouterInputs } from "@/trpc/types";
import { createLoader, parseAsStringLiteral } from "nuqs/server";

type Sort = RouterInputs["events"]["getAll"]["sort"];

export const SortOptions = ["asc", "desc"] as const satisfies Sort[];

export const eventsFiltersParams = {
	sort: parseAsStringLiteral(SortOptions).withDefault("desc"),
};

export const loadEventsFiltersParams = createLoader(eventsFiltersParams);
