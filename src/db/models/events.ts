import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { BaseColumns } from "./_base";
import { MemoryLanes } from "./memory-lanes";

export const Events = pgTable("events", {
	...BaseColumns,
	laneId: uuid()
		.references(() => MemoryLanes.id, {
			onDelete: "cascade",
		})
		.notNull(),
	title: text().notNull(),
	date: timestamp().notNull(),
	description: text(),
	image: text(),
});
