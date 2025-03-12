import { Memories } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const MemoriesInsertSchema = createInsertSchema(Memories, {
	title: (schema) => schema.min(1, "Title is required"),
	image: (schema) => schema.min(1, "Image is required"),
	date: (schema) =>
		schema.refine((date) => date instanceof Date, "Date is required"),
}).partial({
	id: true,
});

export type MemoriesInsertSchema = z.infer<typeof MemoriesInsertSchema>;
