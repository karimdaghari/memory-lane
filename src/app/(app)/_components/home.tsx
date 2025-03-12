import { MemoryLaneCardEdit } from "@/app/(app)/_components/memory-lane";
import { NewIcon } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { MemoryLanesListing } from "./memory-lane/listing";

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
				<MemoryLaneCardEdit>
					<Button>
						<NewIcon />
						Create new lane
					</Button>
				</MemoryLaneCardEdit>
			</div>

			<MemoryLanesListing />
		</div>
	);
}
