"use client";

import { Typography } from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEventsFilters } from "../filters";
import { EventCard, EventCardLoading } from "./card-item";

interface EventListingProps {
	isOwner: boolean;
}

export function EventListing({ isOwner }: EventListingProps) {
	const { id } = useParams<{ id: string }>();
	const {
		filters: { sort },
	} = useEventsFilters();

	const trpc = useTRPC();

	const { data, isLoading, isError } = useQuery(
		trpc.events.getAll.queryOptions({ laneId: id, sort }),
	);

	if (isLoading) return <EventListingSkeleton />;

	if (isError)
		return (
			<Alert>
				<AlertTitle>Error loading events</AlertTitle>
				<AlertDescription>
					Please try again later or contact support if the problem persists.
				</AlertDescription>
			</Alert>
		);

	if (data?.events.length === 0)
		return (
			<Typography variant="muted" className="text-center">
				{isOwner
					? "You don't have any events yet. Create one to get started!"
					: "There are no events in this memory lane yet."}
			</Typography>
		);

	return (
		<div className="space-y-4">
			{data?.events.map((event) => (
				<EventCard key={event.id} {...event} />
			))}
		</div>
	);
}

function EventListingSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 4 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
				<EventCardLoading key={index} />
			))}
		</div>
	);
}
