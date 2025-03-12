import { Memories } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const MemoriesInsertSchema = createInsertSchema(Memories, {
	title: (schema) => schema.min(1, "Title is required"),
	image: z
		.string({
			message: "Image is required",
		})
		.url({
			message: "Image is invalid",
		}),
	date: z
		.date({
			message: "Date is required",
		})
		.refine((date) => date instanceof Date, {
			message: "Date is invalid",
		}),
}).partial({
	id: true,
});

export type MemoriesInsertSchema = z.infer<typeof MemoriesInsertSchema>;
