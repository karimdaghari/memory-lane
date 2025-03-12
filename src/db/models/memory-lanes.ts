import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { BaseColumnsWithAuth } from "./_base";
export const MemoryLanes = pgTable("memory_lanes", {
	...BaseColumnsWithAuth,
	title: text("title").notNull(),
	description: text("description"),
	visibility: varchar("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
});

export type MemoryLane = typeof MemoryLanes.$inferSelect;
export const MemoryLaneSchema = createSelectSchema(MemoryLanes);
