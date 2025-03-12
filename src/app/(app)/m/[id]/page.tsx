import { NewIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client/server";
import { TRPCError } from "@trpc/server";
import { notFound, redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { MemoriesFilters } from "./_components/filters";
import { MemoryHeader } from "./_components/header";
import { MemoriesListing, MemoryCardEdit } from "./_components/memory";
import { loadMemoriesFiltersParams } from "./search-params";

interface Props {
	params: Promise<{ id: string }>;
	searchParams: SearchParams;
}

export default async function Page({ params, searchParams }: Props) {
	const { id } = await params;
	loadMemoriesFiltersParams(searchParams);

	let isOwner = false;
	try {
		isOwner = await api.memoryLanes.checkHasAccess(id);
	} catch (error) {
		if (error instanceof TRPCError && error.code === "NOT_FOUND") {
			notFound();
		} else {
			redirect("/");
		}
	}

	return (
		<div className="space-y-4">
			<MemoryHeader id={id} />

			<div className="flex items-center lg:justify-between lg:flex-row flex-col gap-2 w-full">
				<div className="w-full lg:w-auto">
					<MemoriesFilters />
				</div>
				{isOwner ? (
					<div className="w-full lg:w-auto">
						<MemoryCardEdit laneId={id}>
							<Button className="w-full">
								<NewIcon />
								New memory
							</Button>
						</MemoryCardEdit>
					</div>
				) : null}
			</div>

			<div className="space-y-4 max-w-2xl mx-auto">
				<MemoriesListing isOwner={isOwner} />
			</div>
		</div>
	);
}
