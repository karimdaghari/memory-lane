import type { DB } from "@/db/client";
import { Events } from "@/db/schema";
import { deleteImages } from "@/supabase/storage.server";
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

	const images = events.map((event) => event.image as string);

	await Promise.all([
		db.delete(Events).where(inArray(Events.id, input)),
		deleteImages(images),
	]);
}
