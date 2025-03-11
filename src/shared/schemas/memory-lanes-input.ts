import { MemoryLanes } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const MemoryLanesInsertSchema = createInsertSchema(MemoryLanes, {
	title: (schema) => schema.min(1, "Title is required"),
})
	.omit({
		userId: true,
		slug: true,
	})
	.partial({
		id: true,
	});

export type MemoryLanesInsertSchema = z.infer<typeof MemoryLanesInsertSchema>;
