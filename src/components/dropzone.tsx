"use client";

import { Button } from "@/components/ui/button";
import { useImageDelete } from "@/hooks/use-image-delete";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { CheckCircle, Trash2, UploadCloud, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
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
	initialValue?: string | null;
}

export function Dropzone({
	onImageChange,
	maxSize = 5 * 1024 * 1024, // 5MB default
	className = "",
	initialValue,
}: DropzoneProps) {
	const [image, setImage] = useState<FileWithPreview | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialValue || null,
	);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");

	const { mutate: uploadImage, isPending: isUploading } = useImageUpload();
	const { mutate: deleteImage, isPending: isDeleting } = useImageDelete();

	// Initialize with initialValue if provided
	useEffect(() => {
		if (initialValue && !image) {
			setPreviewUrl(initialValue);
		}
	}, [initialValue, image]);

	// Update previewUrl if initialValue changes
	useEffect(() => {
		setPreviewUrl(initialValue || null);
	}, [initialValue]);

	// Simulate upload progress
	useEffect(() => {
		if (isUploading) {
			setUploadStatus("uploading");
			const interval = setInterval(() => {
				setUploadProgress((prev) => {
					// Cap at 90% until we get actual success
					const newProgress = prev + (90 - prev) * 0.1;
					return newProgress > 90 ? 90 : newProgress;
				});
			}, 100);

			return () => clearInterval(interval);
		}
		if (uploadProgress > 0 && !isUploading) {
			// Complete the progress when upload is done
			setUploadProgress(100);

			// Reset after animation completes
			const timeout = setTimeout(() => {
				if (!isUploading && !isDeleting) {
					setUploadProgress(0);
				}
			}, 1000);

			return () => clearTimeout(timeout);
		}
	}, [isUploading, uploadProgress, isDeleting]);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				// Reset states
				setUploadProgress(0);
				setUploadStatus("uploading");

				// If we already have an image, revoke its object URL to prevent memory leaks
				if (image?.preview) {
					URL.revokeObjectURL(image.preview);
				}

				// Set only the first image with a preview
				const newImage = acceptedFiles[0] as FileWithPreview;
				newImage.preview = URL.createObjectURL(newImage);

				setImage(newImage);
				setPreviewUrl(newImage.preview);

				// Upload the image using the mutation
				uploadImage(newImage, {
					onSuccess: (uploadedUrl) => {
						setUploadStatus("success");
						if (onImageChange) {
							onImageChange(uploadedUrl);
						}

						// Show success toast
						toast.success("Image uploaded successfully");
					},
					onError: () => {
						setUploadStatus("error");
						toast.error("Failed to upload image");
					},
				});
			}
		},
		[image, onImageChange, uploadImage],
	);

	const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
		setUploadStatus("error");
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

		// If we have an image URL, delete it from storage
		if (initialValue) {
			setUploadStatus("idle");
			deleteImage(initialValue, {
				onSuccess: () => {
					setImage(null);
					setPreviewUrl(null);

					// Call external handler if provided
					if (onImageChange) {
						onImageChange(null);
					}

					toast.success("Image removed successfully");
				},
				onError: () => {
					toast.error("Failed to remove image");
				},
			});
		} else {
			// Just remove the preview if there's no URL to delete
			setImage(null);
			setPreviewUrl(null);
			setUploadStatus("idle");

			// Call external handler if provided
			if (onImageChange) {
				onImageChange(null);
			}
		}
	}, [image, onImageChange, deleteImage, initialValue]);

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

	// Calculate the circumference of the progress circle
	const circleRadius = 40;
	const circumference = 2 * Math.PI * circleRadius;
	const strokeDashoffset =
		circumference - (uploadProgress / 100) * circumference;

	return (
		<div className={cn("w-full max-w-md mx-auto", className)}>
			<AnimatePresence mode="wait">
				{!previewUrl ? (
					// @ts-expect-error - this is fine
					<motion.div
						key="dropzone"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
						{...getRootProps()}
						className={cn(
							"relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ease-in-out",
							isDragActive
								? "border-primary bg-primary/5 scale-102"
								: "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30",
						)}
					>
						<input {...getInputProps()} />

						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.1, duration: 0.3 }}
							className="relative"
						>
							<div className="bg-muted/50 rounded-full p-6">
								<UploadCloud className="size-12 text-primary" />
							</div>

							{isDragActive && (
								<motion.div
									initial={{ scale: 0.5, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"
								/>
							)}
						</motion.div>

						<motion.div
							className="mt-6 space-y-2"
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.3 }}
						>
							<h3 className="text-lg font-medium">
								{isDragActive ? "Drop to upload" : "Drag & drop your image"}
							</h3>
							<p className="text-sm text-muted-foreground">or</p>
							<Button
								onClick={open}
								variant="default"
								disabled={isUploading}
								className="mt-2 transition-all duration-200"
								size="sm"
								type="button"
							>
								<UploadCloud className="mr-2 size-4" />
								{isUploading ? "Uploading..." : "Select Image"}
							</Button>
						</motion.div>

						<motion.p
							className="mt-4 text-xs text-muted-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.3 }}
						>
							Supports: JPG, PNG, GIF, WebP (Max:{" "}
							{Math.round(maxSize / (1024 * 1024))}MB)
						</motion.p>
					</motion.div>
				) : (
					<motion.div
						key="preview"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.3 }}
						className="space-y-4"
					>
						<div className="relative overflow-hidden rounded-lg border bg-background shadow-sm">
							<div className="relative h-48 w-full">
								<motion.img
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
									src={previewUrl}
									alt={image?.name || "Uploaded image"}
									className="h-full w-full object-contain"
								/>

								{/* Overlay for uploading/deleting state */}
								<AnimatePresence>
									{(isUploading || isDeleting) && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
										>
											{/* Circular progress indicator */}
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: it's fine for this since it's just a small technical demo */}
											<svg
												width="100"
												height="100"
												className="transform -rotate-90"
											>
												<circle
													cx="50"
													cy="50"
													r={circleRadius}
													fill="transparent"
													stroke="currentColor"
													strokeWidth="4"
													className="text-muted"
												/>
												<motion.circle
													cx="50"
													cy="50"
													r={circleRadius}
													fill="transparent"
													stroke="currentColor"
													strokeWidth="4"
													strokeDasharray={circumference}
													strokeDashoffset={strokeDashoffset}
													className="text-primary"
													initial={{ strokeDashoffset: circumference }}
													animate={{ strokeDashoffset }}
													transition={{ duration: 0.5 }}
												/>
											</svg>
											<p className="mt-2 font-medium">
												{isUploading ? "Uploading..." : "Removing..."}
											</p>
											<p className="text-sm text-muted-foreground">
												{Math.round(uploadProgress)}%
											</p>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Status indicator */}
								<AnimatePresence>
									{uploadStatus === "success" &&
										!isUploading &&
										!isDeleting && (
											<motion.div
												initial={{ opacity: 0, scale: 0.5 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.5 }}
												transition={{ duration: 0.3 }}
												className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1"
											>
												<CheckCircle className="h-5 w-5" />
											</motion.div>
										)}

									{uploadStatus === "error" && !isUploading && !isDeleting && (
										<motion.div
											initial={{ opacity: 0, scale: 0.5 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.5 }}
											transition={{ duration: 0.3 }}
											className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full p-1"
										>
											<XCircle className="h-5 w-5" />
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Image info and actions */}
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="p-3 border-t bg-muted/20"
							>
								<div className="flex items-center justify-between">
									<div className="truncate pr-4">
										<p className="text-sm font-medium truncate">
											{image?.name || "Uploaded image"}
										</p>
										{image && (
											<p className="text-xs text-muted-foreground">
												{(image.size / 1024).toFixed(1)} KB
											</p>
										)}
									</div>

									<Button
										variant="destructive"
										size="sm"
										onClick={removeImage}
										disabled={isUploading || isDeleting}
										className="flex-shrink-0"
										type="button"
									>
										<Trash2 className="h-4 w-4 mr-1" />
										Remove
									</Button>
								</div>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
