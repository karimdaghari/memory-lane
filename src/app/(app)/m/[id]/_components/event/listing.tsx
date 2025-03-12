"use client";

import { Typography } from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEventsFilters } from "../use-filters";
import { EventCard, EventCardLoading } from "./card-item";

interface EventListingProps {
	isOwner: boolean;
}

export function EventsListing({ isOwner }: EventListingProps) {
	const { id } = useParams<{ id: string }>();
	const {
		filters: { sort },
	} = useEventsFilters();

	const trpc = useTRPC();

	const { data, isFetching, isError } = useQuery(
		trpc.events.getAll.queryOptions({ laneId: id, sort }),
	);

	if (isFetching) return <EventListingSkeleton />;

	if (isError)
		return (
			<Alert>
				<AlertTitle>Error loading events</AlertTitle>
				<AlertDescription>
					Please try again later or contact support if the problem persists.
				</AlertDescription>
			</Alert>
		);

	if (!data?.groupedEvents.length)
		return (
			<Typography variant="muted" className="text-center">
				{isOwner
					? "You don't have any events yet. Create one to get started!"
					: "There are no events in this memory lane yet."}
			</Typography>
		);

	return (
		<div className="space-y-8">
			{data.groupedEvents.map((group, index) => (
				<div key={group.date.toISOString()} className="relative">
					{/* Timeline with connector line */}
					<div
						className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted-foreground/30"
						style={{
							display:
								index === data.groupedEvents.length - 1 ? "none" : "block",
						}}
					/>

					{/* Month/Year Header */}
					<div className="flex items-center mb-4">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
							<span className="text-xs font-semibold">
								{dayjs(group.date).format("MMM")}
							</span>
						</div>
						<Typography variant="h3" className="ml-4 font-semibold">
							{dayjs(group.date).format("MMMM YYYY")}
						</Typography>
					</div>

					{/* Events for this month */}
					<div className="ml-12 space-y-4">
						{group.events.map((event) => (
							<EventCard key={event.id} {...event} isOwner={isOwner} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function EventListingSkeleton() {
	return (
		<div className="space-y-8">
			{Array.from({ length: 2 }).map((_, groupIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
				<div key={groupIndex} className="relative">
					{/* Timeline with connector line */}
					<div
						className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted-foreground/30"
						style={{ display: groupIndex === 1 ? "none" : "block" }}
					/>

					{/* Month/Year Header - Skeleton */}
					<div className="flex items-center mb-4">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted animate-pulse" />
						<div className="ml-4 h-7 w-40 bg-muted rounded animate-pulse" />
					</div>

					{/* Events for this month - Skeleton */}
					<div className="ml-12 space-y-4">
						{Array.from({ length: 2 }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
							<EventCardLoading key={index} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
