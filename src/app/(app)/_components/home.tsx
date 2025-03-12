import { MemoryCardEdit } from "@/app/(app)/_components/memory";
import { NewIcon } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { MemoryLanesListing } from "./memory/listing";

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
				<MemoryCardEdit>
					<Button>
						<NewIcon />
						Create a new memory lane
					</Button>
				</MemoryCardEdit>
			</div>

			<MemoryLanesListing />
		</div>
	);
}
