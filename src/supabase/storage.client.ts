import { env } from "@/env/client";
import { nanoid } from "nanoid";
import { supabaseBrowserClient } from "./client";

export async function uploadImage(file: File) {
	const { data, error } = await supabaseBrowserClient.storage
		.from(env.NEXT_PUBLIC_SUPABASE_BUCKET_ID)
		.upload(`/${nanoid()}`, file);

	if (error) {
		throw error;
	}

	const path = data.path;

	const { data: url } = supabaseBrowserClient.storage
		.from(env.NEXT_PUBLIC_SUPABASE_BUCKET_ID)
		.getPublicUrl(path);

	return url.publicUrl;
}

/**
 * Internal helper function: Extracts the file path from a Supabase storage URL
 * @param url The public URL of the image
 * @returns The file path that can be used for deletion
 * @private
 */
function extractFilePathFromUrl(url: string): string {
	if (!url) return "";

	let filePath = url;

	if (url.startsWith("http")) {
		const urlObj = new URL(url);
		const pathParts = urlObj.pathname.split("/");
		const bucketIndex = pathParts.indexOf(env.NEXT_PUBLIC_SUPABASE_BUCKET_ID);

		if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
			filePath = pathParts.slice(bucketIndex + 1).join("/");
		} else {
			filePath = pathParts[pathParts.length - 1];
		}
	}

	if (filePath.startsWith("/")) {
		filePath = filePath.substring(1);
	}

	return filePath;
}

/**
 * Deletes an image from Supabase storage
 * @param url The URL or path of the image to delete. Can be a full URL or just a path.
 */
export async function deleteImageBrowser(url: string) {
	if (!url) return;

	// Extract the path from the URL
	const filePath = extractFilePathFromUrl(url);

	const { error } = await supabaseBrowserClient.storage
		.from(env.NEXT_PUBLIC_SUPABASE_BUCKET_ID)
		.remove([filePath]);

	if (error) {
		throw error;
	}
}
