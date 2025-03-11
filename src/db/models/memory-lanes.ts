import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { BaseColumnsWithAuth } from "./_base";

export const MemoryLanes = pgTable("memory_lanes", {
	...BaseColumnsWithAuth,
	title: text("title").notNull(),
	description: text("description"),
	visibility: varchar("visibility", { enum: ["public", "private"] }).default(
		"private",
	),
});

export type MemoryLane = typeof MemoryLanes.$inferSelect;
