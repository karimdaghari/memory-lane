"use client";
import {
	MemoryCardItem,
	MemoryCardItemSkeletonPage,
} from "@/app/(app)/_components/memory";
import { useTRPC } from "@/trpc/client/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

interface MemoryHeaderProps {
	id: string;
}

export function MemoryHeader(props: MemoryHeaderProps) {
	return (
		<Suspense fallback={<MemoryCardItemSkeletonPage />}>
			<Loader {...props} />
		</Suspense>
	);
}

function Loader({ id }: MemoryHeaderProps) {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.memoryLanes.getByIdOrSlug.queryOptions(id),
	);

	return <MemoryCardItem location="page" {...data} />;
}
