import { uploadImage } from "@/supabase/storage.client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useImageUpload() {
	return useMutation({
		mutationFn: (file: File) => uploadImage(file),
		onSuccess: () => {
			toast.success("Image uploaded successfully");
		},
		onError: (error) => {
			toast.error("Failed to upload image");
			console.error("Upload error:", error);
		},
	});
}
