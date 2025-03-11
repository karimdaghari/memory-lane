import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MemoryCardLoading() {
	return (
		<Card>
			<CardHeader className="flex-row justify-between">
				<div className="w-4/5">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-1/2 mt-2" />
				</div>
				<Skeleton className="size-10 rounded-md" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-20 w-full" />
			</CardContent>
		</Card>
	);
}
