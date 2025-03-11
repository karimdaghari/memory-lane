import { NewIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/client/server";
import type { SearchParams } from "nuqs/server";
import { EventCardEdit } from "./_components/event";
import { EventListing } from "./_components/event/listing";
import { EventsFilters } from "./_components/filters";
import { MemoryHeader } from "./_components/header";
import { loadEventsFiltersParams } from "./search-params";

interface Props {
	params: Promise<{ id: string }>;
	searchParams: SearchParams;
}

export default async function Page({ params, searchParams }: Props) {
	const { id } = await params;
	loadEventsFiltersParams(searchParams);

	return (
		<HydrateClient>
			<div className="space-y-4">
				<MemoryHeader id={id} />
				<div className="flex items-center lg:justify-between lg:flex-row flex-col gap-2 w-full">
					<div className="w-full lg:w-auto">
						<EventsFilters />
					</div>
					<div className="w-full lg:w-auto">
						<EventCardEdit laneId={id}>
							<Button className="w-full">
								<NewIcon />
								New Event
							</Button>
						</EventCardEdit>
					</div>
				</div>
				<div className="space-y-4 max-w-xl mx-auto">
					<EventListing />
				</div>
			</div>
		</HydrateClient>
	);
}
