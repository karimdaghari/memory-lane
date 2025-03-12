import { cn } from "@/lib/utils";
import {
	Loader2,
	LockKeyhole,
	LockKeyholeOpen,
	type LucideProps,
	MoreVertical,
	Pencil,
	Plus,
	Share,
	Trash,
} from "lucide-react";

export const PrivateMemoryIcon = () => <LockKeyhole />;

export const PublicMemoryIcon = () => <LockKeyholeOpen />;

export const EditIcon = () => <Pencil />;

export const DeleteIcon = () => <Trash />;

export const MoreVerticalIcon = () => <MoreVertical />;

export const NewIcon = () => <Plus />;

export const ShareIcon = () => <Share />;

export const LoadingIcon = ({ className, ...props }: LucideProps) => (
	<Loader2 className={cn("animate-spin", className)} {...props} />
);
