import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
	type DropzoneOptions,
	type FileRejection,
	useDropzone,
} from "react-dropzone";

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
	const [error, setError] = useState<string | null>(null);

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
				setError(null);

				// Upload the image using the mutation
				uploadImage(newImage, {
					onSuccess: (uploadedUrl) => {
						if (onImageChange) {
							onImageChange(uploadedUrl);
						}
					},
					onError: () => {
						setError("Failed to upload image. Please try again.");
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
		setError(
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
		<div className={`w-full max-w-md mx-auto ${className}`}>
			<Card>
				<CardContent className="pt-6">
					{!image ? (
						<div
							{...getRootProps()}
							className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
						>
							<input {...getInputProps()} />
							<ImageIcon className="w-12 h-12 mx-auto text-gray-400" />

							<div className="mt-4">
								<p className="text-sm text-gray-700">
									{isDragActive
										? "Drop the image here ..."
										: "Drag & drop an image here, or"}
								</p>
								<Button
									onClick={open}
									variant="outline"
									className="mt-2"
									disabled={isUploading}
								>
									<UploadIcon className="w-4 h-4 mr-2" />
									{isUploading ? "Uploading..." : "Select Image"}
								</Button>
							</div>

							<p className="mt-2 text-xs text-gray-500">
								Supports: JPG, PNG, GIF, WebP (Max:{" "}
								{Math.round(maxSize / (1024 * 1024))}MB)
							</p>
						</div>
					) : (
						<div className="space-y-4">
							<div className="relative rounded-lg overflow-hidden border border-gray-200">
								<img
									src={image.preview}
									alt={image.name}
									className="w-full h-64 object-contain bg-gray-50"
								/>
								<Button
									variant="ghost"
									size="sm"
									onClick={removeImage}
									disabled={isUploading}
									className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
								>
									<XIcon className="w-4 h-4 text-gray-700" />
								</Button>
							</div>
							<div className="flex items-center justify-between">
								<div className="text-sm truncate max-w-xs">
									<span className="font-medium">Filename:</span> {image.name}
								</div>
								<div className="text-sm text-gray-500">
									{(image.size / 1024).toFixed(1)} KB
								</div>
							</div>
							<Button
								onClick={open}
								variant="outline"
								className="w-full"
								disabled={isUploading}
							>
								<UploadIcon className="w-4 h-4 mr-2" />
								{isUploading ? "Uploading..." : "Change Image"}
							</Button>
						</div>
					)}

					{error && (
						<Alert variant="destructive" className="mt-4">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
