import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { BaseColumnsWithAuth } from "./_base";

export const MemoryLanes = pgTable("memory_lanes", {
	...BaseColumnsWithAuth,
	title: text("title").notNull(),
	description: text("description"),
	visibility: varchar("visibility", { enum: ["public", "private"] }).default(
		"private",
	),
	slug: text("slug")
		.notNull()
		.$defaultFn(() => nanoid()),
});

export type MemoryLane = typeof MemoryLanes.$inferSelect;
