import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardLoading() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="w-full aspect-[2/1] rounded-lg" />
			</CardHeader>
			<CardContent className="space-y-2">
				<CardTitle>
					<Skeleton className="h-6 w-3/4" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 w-1/3" />
				</CardDescription>
				<Skeleton className="h-20 w-full" />
			</CardContent>
		</Card>
	);
}
