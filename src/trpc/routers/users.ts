import { updateUserSchema } from "@/shared/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../lib/procedures";

export const usersRouter = createTRPCRouter({
	getUser: authProcedure
		.output(
			z.object({
				name: z.string().optional(),
				avatar: z.string().nullish(),
			}),
		)
		.query(async ({ ctx: { user } }) => {
			try {
				const name = user.user_metadata.name as string | undefined;
				const avatar = user.user_metadata.avatar as string | undefined | null;

				return {
					name,
					avatar,
				};
			} catch (error) {
				console.error("Error fetching user:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch user information",
					cause: error,
				});
			}
		}),
	isLoggedIn: publicProcedure.output(z.boolean()).query(({ ctx }) => {
		try {
			return ctx.user !== null;
		} catch (error) {
			console.error("Error checking login status:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to verify login status",
				cause: error,
			});
		}
	}),
	updateUser: authProcedure
		.input(updateUserSchema)
		.output(z.object({ success: z.boolean(), message: z.string() }))
		.mutation(async ({ ctx: { supabase }, input: { name } }) => {
			try {
				const { error } = await supabase.auth.updateUser({
					data: {
						name,
					},
				});

				if (error) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: error.message || "Failed to update user",
					});
				}

				return {
					success: true,
					message: "User updated successfully",
				};
			} catch (error) {
				console.error("Error updating user:", error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						error instanceof Error ? error.message : "Failed to update user",
					cause: error,
				});
			}
		}),
});
