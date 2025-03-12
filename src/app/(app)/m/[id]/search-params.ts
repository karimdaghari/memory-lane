import type { RouterInputs } from "@/trpc/types";
import { createLoader, parseAsStringLiteral } from "nuqs/server";

type Sort = RouterInputs["memories"]["getAll"]["sort"];

export const SortOptions = ["asc", "desc"] as const satisfies Sort[];

export const memoriesFiltersParams = {
	sort: parseAsStringLiteral(SortOptions).withDefault("desc"),
};

export const loadMemoriesFiltersParams = createLoader(memoriesFiltersParams);
