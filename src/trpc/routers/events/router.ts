import { Events } from "@/db/schema";
import { EventsInsertSchema } from "@/shared/schemas/events-input";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../../lib/procedures";
import { deleteEvent } from "./delete-event";

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
				laneId: z.string().uuid(),
				sort: z.enum(["asc", "desc"]).default("asc"),
			}),
		)
		.query(async ({ ctx: { db }, input: { laneId, sort } }) => {
			try {
				const memoryLane = await db.query.MemoryLanes.findFirst({
					where: (f, op) => op.eq(f.id, laneId),
				});

				if (!memoryLane) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Memory lane not found",
					});
				}

				const events = await db.query.Events.findMany({
					where: (f, op) => op.eq(f.laneId, laneId),
					orderBy: (f, op) =>
						sort === "desc" ? op.desc(f.date) : op.asc(f.date),
				});

				// Group events by month/year
				const groupedEventsMap = events.reduce(
					(acc, event) => {
						const date = event.date;
						// Create a new Date object set to the first of the month
						const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
						const key = monthDate.toISOString();

						if (!acc[key]) {
							acc[key] = {
								date: monthDate,
								events: [],
							};
						}

						acc[key].events.push(event);
						return acc;
					},
					{} as Record<string, { date: Date; events: typeof events }>,
				);

				// Convert to array and sort
				const groupedEvents = Object.values(groupedEventsMap).sort((a, b) => {
					return sort === "desc"
						? b.date.getTime() - a.date.getTime()
						: a.date.getTime() - b.date.getTime();
				});

				return {
					events,
					groupedEvents,
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
		.input(
			EventsInsertSchema.omit({ id: true }).required({
				laneId: true,
			}),
		)
		.mutation(async ({ ctx: { db }, input }) => {
			try {
				const [data] = await db.insert(Events).values(input).returning();

				return data;
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create memory lane",
					cause: err,
				});
			}
		}),
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
