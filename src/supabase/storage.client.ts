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
