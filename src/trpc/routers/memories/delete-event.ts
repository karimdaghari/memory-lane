import type { DB } from "@/db/client";
import { Memories } from "@/db/schema";
import { deleteImages } from "@/supabase/storage.server";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";

interface DeleteMemoryProps {
	db: DB;
	input: {
		id?: string;
		ids?: string[];
	};
}

export async function deleteMemory({
	db,
	input: { id, ids },
}: DeleteMemoryProps) {
	const input = (Array.isArray(ids) ? ids : [id]).filter(
		(i) => i !== undefined,
	);

	if (!input) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "No id or ids provided",
		});
	}

	const memories = await db.query.Memories.findMany({
		where: (f, op) => op.inArray(f.id, input),
		columns: {
			image: true,
		},
	});

	const images = memories.map(({ image }) => image);

	await Promise.all([
		db.delete(Memories).where(inArray(Memories.id, input)),
		deleteImages(images),
	]);
}
