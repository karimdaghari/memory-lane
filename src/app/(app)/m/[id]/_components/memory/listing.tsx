"use client";

import { Typography } from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTRPC } from "@/trpc/client/react";
import type { RouterOutputs } from "@/trpc/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useMemoriesFilters } from "../use-filters";
import { MemoryCard, MemoryCardSkeleton } from "./card-item";

interface MemoriesListingProps {
	isOwner: boolean;
}

export function MemoriesListing({ isOwner }: MemoriesListingProps) {
	const { id } = useParams<{ id: string }>();
	const {
		filters: { sort },
	} = useMemoriesFilters();

	const trpc = useTRPC();

	const { data, isFetching, isError } = useQuery(
		trpc.memories.getAll.queryOptions({ laneId: id, sort }),
	);

	if (isFetching) return <MemoriesListingSkeleton />;

	if (isError)
		return (
			<Alert>
				<AlertTitle>Error loading events</AlertTitle>
				<AlertDescription>
					Please try again later or contact support if the problem persists.
				</AlertDescription>
			</Alert>
		);

	if (!data?.groupedMemories.length)
		return (
			<Typography variant="muted" className="text-center">
				{isOwner
					? "You don't have any memories yet. Create one to get started!"
					: "There are no memories in this memory lane yet."}
			</Typography>
		);

	return (
		<MemoriesTimeline
			groupedMemories={data.groupedMemories}
			isOwner={isOwner}
		/>
	);
}

type GroupedMemory =
	RouterOutputs["memories"]["getAll"]["groupedMemories"][number];

interface MemoriesTimelineProps {
	groupedMemories: GroupedMemory[];
	isOwner: boolean;
}

function MemoriesTimeline({ groupedMemories, isOwner }: MemoriesTimelineProps) {
	return (
		<div className="space-y-8">
			{groupedMemories.map((group, index) => (
				<div key={group.date.toISOString()} className="relative">
					{/* Timeline with connector line */}
					<div
						className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted-foreground/30"
						style={{
							display: index === groupedMemories.length - 1 ? "none" : "block",
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

					{/* Memories for this month */}
					<div className="ml-12 space-y-4">
						{group.memories.map((memory) => (
							<MemoryCard key={memory.id} {...memory} isOwner={isOwner} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function MemoriesListingSkeleton() {
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

					{/* Memories for this month - Skeleton */}
					<div className="ml-12 space-y-4">
						{Array.from({ length: 2 }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
							<MemoryCardSkeleton key={index} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
