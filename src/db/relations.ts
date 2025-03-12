import { relations } from "drizzle-orm";
import { Memories } from "./models/memories";
import { MemoryLanes } from "./models/memory-lanes";

export const memoryLaneRelations = relations(MemoryLanes, ({ many }) => ({
	events: many(Memories),
}));

export const eventRelations = relations(Memories, ({ one }) => ({
	lane: one(MemoryLanes, {
		fields: [Memories.laneId],
		references: [MemoryLanes.id],
	}),
}));
