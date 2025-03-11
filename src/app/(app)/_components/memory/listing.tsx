"use client";

import { Typography } from "@/components/typography";
import { useTRPC } from "@/trpc/client/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { MemoryCardItem, MemoryCardItemSkeletonListing } from "./card-item";

export function MemoryLanesListing() {
	return (
		<div>
			<Suspense fallback={<MemoryListingSkeleton />}>
				<Loader />
			</Suspense>
		</div>
	);
}

function Loader() {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(trpc.memoryLanes.getAll.queryOptions());

	if (data.length === 0) {
		return (
			<Typography variant="muted" className="text-center">
				You don't have any memory lanes yet. Create one to get started!
			</Typography>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{data.map((memoryLane) => (
				<MemoryCardItem key={memoryLane.id} {...memoryLane} />
			))}
		</div>
	);
}

function MemoryListingSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{Array.from({ length: 3 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
				<MemoryCardItemSkeletonListing key={index} />
			))}
		</div>
	);
}
