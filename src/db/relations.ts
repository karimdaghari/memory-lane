import { relations } from "drizzle-orm";
import { Events } from "./models/events";
import { MemoryLanes } from "./models/memory-lanes";

export const memoryLaneRelations = relations(MemoryLanes, ({ many }) => ({
	events: many(Events),
}));

export const eventRelations = relations(Events, ({ one }) => ({
	lane: one(MemoryLanes, {
		fields: [Events.laneId],
		references: [MemoryLanes.id],
	}),
}));
