import { Events, MemoryLanes } from "@/db/schema";
import { EventsInsertSchema } from "@/shared/schemas/events-input";
import { MemoryLanesInsertSchema } from "@/shared/schemas/memory-lanes-input";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../../lib/procedures";
import { deleteEvent } from "./lib";

export const eventsRouter = createTRPCRouter({
	/**
	 * Get all events for a memory lane, sorted and grouped by month/year.
	 *
	 * @example
	 * // Given these events:
	 * const events = [
	 *   { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *   { id: "2", date: "2024-03-20", title: "First Day of Spring" },
	 *   { id: "2", date: "2024-02-14", title: "Valentine's Day" },
	 *   { id: "3", date: "2024-01-01", title: "New Year's Day" },
	 *   { id: "4", date: "2024-03-01", title: "March Event" }
	 * ]
	 *
	 * // With sort: "asc" (default)
	 * {
	 *   events: [ // Chronologically sorted from past to future
	 *     { id: "3", date: "2024-01-01", title: "New Year's Day" },
	 *     { id: "2", date: "2024-02-14", title: "Valentine's Day" },
	 *     { id: "4", date: "2024-03-01", title: "March Event" },
	 *     { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *     { id: "2", date: "2024-03-20", title: "First Day of Spring" }
	 *   ],
	 *   groupedEvents: { // Months sorted chronologically
	 *     "January 2024": [{ id: "3", date: "2024-01-01", title: "New Year's Day" }],
	 *     "February 2024": [{ id: "2", date: "2024-02-14", title: "Valentine's Day" }],
	 *     "March 2024": [
	 *       { id: "4", date: "2024-03-01", title: "March Event" },
	 *       { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *       { id: "2", date: "2024-03-20", title: "First Day of Spring" }
	 *     ]
	 *   }
	 * }
	 *
	 * // With sort: "desc"
	 * {
	 *   events: [ // Chronologically sorted from future to past
	 *     { id: "2", date: "2024-03-20", title: "First Day of Spring" },
	 *     { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *     { id: "4", date: "2024-03-01", title: "March Event" },
	 *     { id: "2", date: "2024-02-14", title: "Valentine's Day" },
	 *     { id: "3", date: "2024-01-01", title: "New Year's Day" }
	 *   ],
	 *   groupedEvents: { // Months sorted chronologically in reverse
	 *     "March 2024": [
	 *       { id: "2", date: "2024-03-20", title: "First Day of Spring" },
	 *       { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *       { id: "4", date: "2024-03-01", title: "March Event" }
	 *     ],
	 *     "February 2024": [{ id: "2", date: "2024-02-14", title: "Valentine's Day" }],
	 *     "January 2024": [{ id: "3", date: "2024-01-01", title: "New Year's Day" }]
	 *   }
	 * }
	 */
	getAll: publicProcedure
		.input(
			z.object({
				laneId: z.string(),
				sort: z.enum(["asc", "desc"]).default("asc"),
			}),
		)
		.query(async ({ ctx: { db }, input: { laneId, sort } }) => {
			try {
				const events = await db.query.Events.findMany({
					where: (f, op) => op.eq(f.laneId, laneId),
					orderBy: (f, op) =>
						sort === "desc" ? op.desc(f.date) : op.asc(f.date),
				});

				// Group events by month/year
				const groupedEvents = events.reduce(
					(acc, event) => {
						const date = event.date;
						const monthYear = date.toLocaleString("default", {
							month: "long",
							year: "numeric",
						});

						if (!acc[monthYear]) {
							acc[monthYear] = [];
						}

						acc[monthYear].push(event);
						return acc;
					},
					{} as Record<string, typeof events>,
				);

				// Sort the month/year keys based on the first event's date in each group
				const sortedKeys = Object.keys(groupedEvents).sort((a, b) => {
					const dateA = groupedEvents[a].at(0)?.date.getTime();
					const dateB = groupedEvents[b].at(0)?.date.getTime();

					if (!dateA || !dateB) {
						return 0;
					}

					return sort === "desc" ? dateB - dateA : dateA - dateB;
				});

				// Create a new object with sorted groups
				const sortedGroupedEvents = sortedKeys.reduce(
					(acc, key) => {
						acc[key] = groupedEvents[key];
						return acc;
					},
					{} as Record<string, typeof events>,
				);

				return {
					events,
					groupedEvents: sortedGroupedEvents,
				};
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get events",
					cause: err,
				});
			}
		}),
	create: authProcedure
		.input(MemoryLanesInsertSchema.omit({ id: true }))
		.mutation(
			async ({
				ctx: {
					db,
					user: { id: userId },
				},
				input,
			}) => {
				try {
					const [data] = await db
						.insert(MemoryLanes)
						.values({
							...input,
							userId,
						})
						.returning();

					return data;
				} catch (err) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to create memory lane",
						cause: err,
					});
				}
			},
		),
	update: authProcedure
		.input(EventsInsertSchema.required({ id: true }))
		.mutation(async ({ ctx: { db }, input: { id, ...input } }) => {
			try {
				await db.update(Events).set(input).where(eq(Events.id, id));

				return {
					success: true,
				};
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update event",
					cause: err,
				});
			}
		}),
	delete: authProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx: { db }, input: { id } }) => {
			try {
				await deleteEvent({ db, input: { id } });

				return {
					success: true,
				};
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete event",
					cause: err,
				});
			}
		}),
});
