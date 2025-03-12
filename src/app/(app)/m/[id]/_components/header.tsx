"use client";
import {
	MemoryLaneCardItem,
	MemoryLaneCardItemSkeletonPage,
} from "@/app/(app)/_components/memory-lane";
import { useTRPC } from "@/trpc/client/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

interface MemoryHeaderProps {
	id: string;
}

export function MemoryHeader(props: MemoryHeaderProps) {
	return (
		<Suspense fallback={<MemoryLaneCardItemSkeletonPage />}>
			<Loader {...props} />
		</Suspense>
	);
}

function Loader({ id }: MemoryHeaderProps) {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(trpc.memoryLanes.getById.queryOptions(id));

	return <MemoryLaneCardItem location="page" {...data} />;
}
