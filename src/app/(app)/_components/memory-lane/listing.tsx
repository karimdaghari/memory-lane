"use client";

import { Typography } from "@/components/typography";
import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import {
	MemoryLaneCardItem,
	MemoryLaneCardItemSkeletonListing,
} from "./card-item";

export function MemoryLanesListing() {
	const trpc = useTRPC();

	const { data, isLoading } = useQuery(trpc.memoryLanes.getAll.queryOptions());

	if (isLoading) return <MemoryListingSkeleton />;

	if (data?.length === 0)
		return (
			<Typography variant="muted" className="text-center">
				You don't have any memory lanes yet. Create one to get started!
			</Typography>
		);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{data?.map((memoryLane) => (
				<MemoryLaneCardItem key={memoryLane.id} {...memoryLane} />
			))}
		</div>
	);
}

function MemoryListingSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{Array.from({ length: 4 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
				<MemoryLaneCardItemSkeletonListing key={index} />
			))}
		</div>
	);
}
