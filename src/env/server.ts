import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
	extends: [vercel()],
	server: {
		DATABASE_URL: z.string().min(1).startsWith("postgresql://"),
		SUPABASE_URL: z.string().min(1),
		SUPABASE_ANON_KEY: z.string().min(1),
		SUPABASE_BUCKET_ID: z.string().min(1),
		SITE_URL: z.string().startsWith("https://").endsWith("/"),
	},
	experimental__runtimeEnv: process.env,
});
