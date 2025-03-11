import { env } from "@/env/server";
import { createClient } from "./server";

export async function deleteImages(images: string[]) {
	if (images.length === 0) return;

	const supabase = await createClient();

	const { error } = await supabase.storage
		.from(env.SUPABASE_BUCKET_ID)
		.remove(images);

	if (error) {
		throw error;
	}
}
