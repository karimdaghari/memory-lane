import { env } from "@/env/client";
import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowserClient = createBrowserClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
