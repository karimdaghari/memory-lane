import { deleteImageBrowser } from "@/supabase/storage.client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useImageDelete() {
	return useMutation({
		mutationFn: (path: string) => deleteImageBrowser(path),
		onSuccess: () => {
			toast.success("Image deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete image");
			console.error("Delete error:", error);
		},
	});
}
