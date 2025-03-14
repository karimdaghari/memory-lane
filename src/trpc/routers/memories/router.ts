import { Memories, MemoriesSelectSchema } from "@/db/schema";
import { MemoriesInsertSchema } from "@/shared/schemas";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../../lib/procedures";
import { deleteMemory } from "./delete-memory";

export const memoriesRouter = createTRPCRouter({
	/**
	 * Get all memories for a memory lane, sorted and grouped by month/year.
	 *
	 * @param laneId - UUID of the memory lane to fetch memories from
	 * @param sort - Sort direction for memories, either "asc" (oldest first) or "desc" (newest first)
	 * @returns Object containing flat array of memories and grouped memories by month
	 *
	 * @example
	 * // Given these memories:
	 * const memories = [
	 *   { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *   { id: "2", date: "2024-03-20", title: "First Day of Spring" },
	 *   { id: "2", date: "2024-02-14", title: "Valentine's Day" },
	 *   { id: "3", date: "2024-01-01", title: "New Year's Day" },
	 *   { id: "4", date: "2024-03-01", title: "March Event" }
	 * ]
	 *
	 * // With sort: "asc"
	 * {
	 *   memories: [ // Chronologically sorted from past to future
	 *     { id: "3", date: "2024-01-01", title: "New Year's Day" },
	 *     { id: "2", date: "2024-02-14", title: "Valentine's Day" },
	 *     { id: "4", date: "2024-03-01", title: "March Event" },
	 *     { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *     { id: "2", date: "2024-03-20", title: "First Day of Spring" }
	 *   ],
	 *   groupedMemories: [ // Months sorted chronologically
	 *     {
	 *       date: new Date("2024-01-01"),
	 *       memories: [{ id: "3", date: "2024-01-01", title: "New Year's Day" }]
	 *     },
	 *     {
	 *       date: new Date("2024-02-01"),
	 *       memories: [{ id: "2", date: "2024-02-14", title: "Valentine's Day" }]
	 *     },
	 *     {
	 *       date: new Date("2024-03-01"),
	 *       memories: [
	 *         { id: "4", date: "2024-03-01", title: "March Event" },
	 *         { id: "1", date: "2024-03-15", title: "Spring Break" },
	 *         { id: "2", date: "2024-03-20", title: "First Day of Spring" }
	 *       ]
	 *     }
	 *   ]
	 * }
	 */
	getAll: publicProcedure
		.input(
			z.object({
				laneId: z.string().uuid(),
				sort: z.enum(["asc", "desc"]).default("desc"),
			}),
		)
		.output(
			z.object({
				memories: MemoriesSelectSchema.array(),
				groupedMemories: z.array(
					z.object({
						date: z.date(),
						memories: MemoriesSelectSchema.array(),
					}),
				),
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

				const memories = await db.query.Memories.findMany({
					where: (f, op) => op.eq(f.laneId, laneId),
					orderBy: (f, op) =>
						sort === "desc" ? op.desc(f.date) : op.asc(f.date),
				});

				// Group events by month/year
				const groupedMemoriesMap = memories.reduce(
					(acc, memory) => {
						const date = memory.date;
						// Create a new Date object set to the first of the month
						const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
						const key = monthDate.toISOString();

						if (!acc[key]) {
							acc[key] = {
								date: monthDate,
								memories: [],
							};
						}

						acc[key].memories.push(memory);
						return acc;
					},
					{} as Record<string, { date: Date; memories: typeof memories }>,
				);

				// Convert to array and sort
				const groupedMemories = Object.values(groupedMemoriesMap).sort(
					(a, b) => {
						return sort === "desc"
							? b.date.getTime() - a.date.getTime()
							: a.date.getTime() - b.date.getTime();
					},
				);

				return {
					memories,
					groupedMemories,
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
			MemoriesInsertSchema.omit({ id: true }).required({
				laneId: true,
			}),
		)
		.output(MemoriesSelectSchema)
		.mutation(async ({ ctx: { db }, input }) => {
			try {
				const [data] = await db.insert(Memories).values(input).returning();

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
		.input(MemoriesInsertSchema.required({ id: true }))
		.output(z.object({ success: z.boolean() }))
		.mutation(async ({ ctx: { db }, input: { id, ...input } }) => {
			try {
				await db.update(Memories).set(input).where(eq(Memories.id, id));

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
		.output(z.object({ success: z.boolean() }))
		.mutation(async ({ ctx: { db }, input: { id } }) => {
			try {
				await deleteMemory({ db, input: { id } });

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
