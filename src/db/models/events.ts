import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
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
	image: text().notNull(),
	description: text(),
});

export const EventsSelectSchema = createSelectSchema(Events);
