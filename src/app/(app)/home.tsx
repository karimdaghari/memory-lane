import {
	MemoryCard,
	MemoryCardEdit,
	MemoryCardLoading,
} from "@/app/(app)/_components/memory";
import { NewIcon } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="space-y-4">
			<div className="space-y-0 text-center">
				<Typography variant="h1">My Memory Lanes</Typography>
				<Typography variant="muted">
					Manage all your memories from one place
				</Typography>
			</div>

			<div className="flex justify-end">
				<MemoryCardEdit title="New Memory Lane">
					<Button>
						<NewIcon />
						Create a new memory lane
					</Button>
				</MemoryCardEdit>
			</div>

			<Typography variant="muted" className="text-center">
				You don't have any memory lanes yet. Create one to get started!
			</Typography>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{Array.from({ length: 3 }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
					<MemoryCardLoading key={index} />
				))}
				<MemoryCard />
			</div>
		</div>
	);
}
