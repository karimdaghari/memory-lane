import { Events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const EventsInsertSchema = createInsertSchema(Events, {
	title: (schema) => schema.min(1, "Title is required"),
	image: (schema) => schema.min(1, "Image is required"),
	date: (schema) =>
		schema.refine((date) => date instanceof Date, "Date is required"),
}).partial({
	id: true,
});

export type EventsInsertSchema = z.infer<typeof EventsInsertSchema>;
