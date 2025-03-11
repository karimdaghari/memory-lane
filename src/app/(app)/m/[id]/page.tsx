import { NewIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { SearchParams } from "nuqs/server";
import {
	EventCard,
	EventCardEdit,
	EventCardLoading,
} from "./_components/event";
import { MemoryHeader } from "./_components/header";
import { SelectSorting } from "./_components/select-sorting";
import { loadSortingSearchParams } from "./search-params";

interface Props {
	params: Promise<{ id: string }>;
	searchParams: SearchParams;
}

export default async function Page({ params, searchParams }: Props) {
	const { id } = await params;
	await loadSortingSearchParams(searchParams);

	return (
		<div className="space-y-4">
			<MemoryHeader />
			<div className="flex items-center lg:justify-between lg:flex-row flex-col gap-2 w-full">
				<div className="w-full lg:w-auto">
					<SelectSorting />
				</div>
				<div className="w-full lg:w-auto">
					<EventCardEdit title="Untitled" date={new Date()} laneId="1" id="1">
						<Button className="w-full">
							<NewIcon />
							New Event
						</Button>
					</EventCardEdit>
				</div>
			</div>
			<div className="space-y-4 max-w-xl mx-auto">
				<EventCardLoading />
				<EventCard />
			</div>
		</div>
	);
}
