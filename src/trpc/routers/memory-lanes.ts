import { MemoryLaneSchema, MemoryLanes } from "@/db/schema";
import { MemoryLanesInsertSchema } from "@/shared/schemas";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../lib/procedures";
import { deleteEvent } from "./events/delete-event";

export const memoryLanesRouter = createTRPCRouter({
	getAll: authProcedure.output(MemoryLaneSchema.array()).query(
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
	getById: publicProcedure
		.input(z.string().uuid())
		.output(
			MemoryLaneSchema.extend({
				isOwner: z.boolean(),
			}),
		)
		.query(async ({ ctx: { db, user }, input }) => {
			try {
				const data = await db.query.MemoryLanes.findFirst({
					where: (f, op) => op.eq(f.id, input),
				});

				if (!data) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Memory lane not found",
					});
				}

				const isOwner = user?.id === data.userId;

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
	checkHasAccess: publicProcedure
		.input(z.string().uuid())
		.output(
			z.boolean().describe("Whether the user has access to the memory lane"),
		)
		.query(async ({ ctx: { db, user }, input }) => {
			const data = await db.query.MemoryLanes.findFirst({
				where: (f, op) => op.eq(f.id, input),
			});

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Memory lane not found",
				});
			}

			const isOwner = user?.id === data.userId;

			if (data.visibility === "private" && !isOwner) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You do not have access to this memory lane",
				});
			}

			return isOwner;
		}),
	create: authProcedure
		.input(MemoryLanesInsertSchema.omit({ id: true }))
		.output(MemoryLaneSchema)
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
		.output(z.object({ success: z.boolean() }))
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
		.output(z.object({ success: z.boolean() }))
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
