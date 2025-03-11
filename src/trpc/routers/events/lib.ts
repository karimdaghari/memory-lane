import type { DB } from "@/db/client";
import { Events } from "@/db/schema";
import { createClient } from "@/db/supabase/server";
import { env } from "@/env/server";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";

interface DeleteEventProps {
	db: DB;
	input: {
		id?: string;
		ids?: string[];
	};
}

export async function deleteEvent({
	db,
	input: { id, ids },
}: DeleteEventProps) {
	const input = (Array.isArray(ids) ? ids : [id]).filter(
		(i) => i !== undefined,
	);

	if (!input) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No id or ids provided",
		});
	}

	const events = await db.query.Events.findMany({
		where: (f, op) => op.and(op.isNotNull(f.image), op.inArray(f.id, input)),
		columns: {
			image: true,
		},
	});

	const imageUrls = events.map((event) => event.image as string);

	const supabase = await createClient();

	await Promise.all([
		db.delete(Events).where(inArray(Events.id, input)),
		supabase.storage.from(env.SUPABASE_BUCKET_ID).remove(imageUrls),
	]);
}
