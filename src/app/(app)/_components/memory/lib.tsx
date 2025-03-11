import { PrivateMemoryIcon, PublicMemoryIcon } from "@/components/icons";
import type { MemoryLane } from "@/db/schema";

type Visibility = MemoryLane["visibility"];

export function getMemoryLaneVisibilityIcon(visibility: Visibility) {
	if (visibility === "public") {
		return <PublicMemoryIcon />;
	}
	return <PrivateMemoryIcon />;
}

export function getMemoryLaneVisibilityLabel(visibility: Visibility) {
	if (visibility === "public") {
		return "Public";
	}
	return "Private";
}
