import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
	type DropzoneOptions,
	type FileRejection,
	useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

interface FileWithPreview extends File {
	preview: string;
}

interface DropzoneProps {
	onImageChange?: (uploadedUrl?: string | null) => void;
	maxSize?: number; // in bytes
	className?: string;
}

export function Dropzone({
	onImageChange,
	maxSize = 5 * 1024 * 1024, // 5MB default
	className = "",
}: DropzoneProps) {
	const [image, setImage] = useState<FileWithPreview | null>(null);

	const { mutate: uploadImage, isPending: isUploading } = useImageUpload();

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				// If we already have an image, revoke its object URL to prevent memory leaks
				if (image?.preview) {
					URL.revokeObjectURL(image.preview);
				}

				// Set only the first image with a preview
				const newImage = acceptedFiles[0] as FileWithPreview;
				newImage.preview = URL.createObjectURL(newImage);

				setImage(newImage);

				// Upload the image using the mutation
				uploadImage(newImage, {
					onSuccess: (uploadedUrl) => {
						if (onImageChange) {
							onImageChange(uploadedUrl);
						}
					},
				});
			}
		},
		[image, onImageChange, uploadImage],
	);

	const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
		const rejectionReasons = rejectedFiles[0]?.errors
			.map((error) => error.message)
			.join(", ");
		toast.error(
			`Image rejected: ${rejectionReasons || "Please upload a JPG, PNG, GIF or WebP image under 5MB"}`,
		);
	}, []);

	const removeImage = useCallback(() => {
		if (image?.preview) {
			URL.revokeObjectURL(image.preview);
		}
		setImage(null);

		// Call external handler if provided
		if (onImageChange) {
			onImageChange(null);
		}
	}, [image, onImageChange]);

	// Clean up object URLs when component unmounts
	React.useEffect(() => {
		return () => {
			if (image?.preview) {
				URL.revokeObjectURL(image.preview);
			}
		};
	}, [image]);

	const dropzoneOptions: DropzoneOptions = {
		onDrop,
		onDropRejected,
		noClick: true,
		maxSize,
		maxFiles: 1,
		multiple: false,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
		},
	};

	const { getRootProps, getInputProps, isDragActive, open } =
		useDropzone(dropzoneOptions);

	return (
		<div className={cn("w-full max-w-md mx-auto", className)}>
			{!image ? (
				<div
					{...getRootProps()}
					className={cn(
						"relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors",
						isDragActive
							? "border-primary bg-primary/5 text-primary"
							: "border-muted-foreground/25 hover:border-muted-foreground/50",
					)}
				>
					<input {...getInputProps()} />
					<ImageIcon className="h-12 w-12 text-muted-foreground" />

					<div className="mt-4 space-y-2">
						<h3 className="text-sm font-medium">
							{isDragActive
								? "Drop the image here ..."
								: "Drag & drop an image here"}
						</h3>
						<p className="text-xs text-muted-foreground">or</p>
						<Button
							onClick={open}
							variant="secondary"
							disabled={isUploading}
							className="mt-2"
							size="sm"
						>
							<UploadIcon className="mr-2 h-4 w-4" />
							{isUploading ? "Uploading..." : "Select Image"}
						</Button>
					</div>

					<p className="mt-4 text-xs text-muted-foreground">
						Supports: JPG, PNG, GIF, WebP (Max:{" "}
						{Math.round(maxSize / (1024 * 1024))}MB)
					</p>
				</div>
			) : (
				<div className="space-y-4">
					<div className="relative overflow-hidden rounded-md border bg-background">
						<img
							src={image.preview}
							alt={image.name}
							className="mx-auto h-64 w-full object-contain"
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={removeImage}
							disabled={isUploading}
							className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background shadow-sm"
						>
							<XIcon className="h-4 w-4" />
						</Button>
					</div>

					{isUploading && (
						<div className="w-full h-1 bg-muted relative overflow-hidden rounded-full">
							<div
								className="h-full bg-primary transition-all absolute left-0 top-0"
								style={{ width: "66%" }}
							/>
						</div>
					)}

					<div className="flex items-center justify-between text-sm">
						<div className="max-w-xs truncate">
							<span className="font-medium">File:</span> {image.name}
						</div>
						<div className="text-muted-foreground">
							{(image.size / 1024).toFixed(1)} KB
						</div>
					</div>

					<Button
						onClick={open}
						variant="outline"
						className="w-full"
						disabled={isUploading}
						size="sm"
					>
						<UploadIcon className="mr-2 h-4 w-4" />
						{isUploading ? "Uploading..." : "Change Image"}
					</Button>
				</div>
			)}
		</div>
	);
}
