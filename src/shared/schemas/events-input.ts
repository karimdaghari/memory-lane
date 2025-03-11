import { Events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const EventsInsertSchema = createInsertSchema(Events, {
	title: (schema) => schema.min(1, "Title is required"),
}).partial({
	id: true,
});

export type EventsInsertSchema = z.infer<typeof EventsInsertSchema>;
