import { MemoryLanes } from "@/db/schema";
import { MemoryLanesInsertSchema } from "@/shared/schemas/memory-lanes-input";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../lib/procedures";
import { deleteEvent } from "./events/lib";

export const memoryLanesRouter = createTRPCRouter({
	getAll: authProcedure.query(
		async ({
			ctx: {
				db,
				user: { id: userId },
			},
		}) => {
			try {
				const data = await db.query.MemoryLanes.findMany({
					where: (f, op) => op.eq(f.userId, userId),
				});

				return data;
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get memory lanes",
					cause: err,
				});
			}
		},
	),
	getBySlug: publicProcedure
		.input(z.string())
		.query(async ({ ctx: { db, user }, input }) => {
			try {
				const data = await db.query.MemoryLanes.findFirst({
					where: (f, op) => op.eq(f.slug, input),
				});

				if (!data) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Memory lane not found",
					});
				}

				let isOwner = false;

				if (user?.id === data.userId) {
					isOwner = true;
				}

				return {
					...data,
					isOwner,
				};
			} catch (err) {
				if (err instanceof TRPCError) {
					throw err;
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get memory lane",
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
		.input(MemoryLanesInsertSchema.required({ id: true }))
		.mutation(async ({ ctx: { db }, input: { id, ...input } }) => {
			try {
				await db.update(MemoryLanes).set(input).where(eq(MemoryLanes.id, id));

				return {
					success: true,
				};
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update memory lane",
					cause: err,
				});
			}
		}),
	delete: authProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx: { db }, input }) => {
			try {
				const relatedEvents = await db.query.Events.findMany({
					where: (f, op) => op.eq(f.laneId, input.id),
					columns: {
						id: true,
					},
				});

				const relatedEventsIds = relatedEvents.map((event) => event.id);

				await deleteEvent({ db, input: { ids: relatedEventsIds } });

				await db.delete(MemoryLanes).where(eq(MemoryLanes.id, input.id));

				return {
					success: true,
				};
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete memory lane",
					cause: err,
				});
			}
		}),
});
