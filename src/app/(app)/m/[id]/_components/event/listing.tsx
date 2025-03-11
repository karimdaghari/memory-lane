"use client";

import { Typography } from "@/components/typography";
import { useTRPC } from "@/trpc/client/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useEventsFilters } from "../filters";
import { EventCard, EventCardLoading } from "./card-item";

export function EventListing() {
	return (
		<div>
			<Suspense fallback={<EventListingSkeleton />}>
				<Loader />
			</Suspense>
		</div>
	);
}

function Loader() {
	const { id } = useParams<{ id: string }>();
	const {
		filters: { sort },
	} = useEventsFilters();

	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.events.getAll.queryOptions({ laneId: id, sort }),
	);

	if (data.events.length === 0) {
		return (
			<Typography variant="muted" className="text-center">
				You don't have any events yet. Create one to get started!
			</Typography>
		);
	}

	return (
		<div className="space-y-4">
			{data.events.map((event) => (
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
