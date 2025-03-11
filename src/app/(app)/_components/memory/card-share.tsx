import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton } from "../copy-button";

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	value: string;
}

export function MemoryCardShare({
	children,
	open,
	onOpenChange,
	value,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share your memory</DialogTitle>
					<DialogDescription>
						Share your memory with your friends and family.
					</DialogDescription>
				</DialogHeader>

				<CopyButton value={value} />
			</DialogContent>
		</Dialog>
	);
}
