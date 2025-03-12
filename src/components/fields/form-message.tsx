"use client";

import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Typography } from "../typography";

export function FormMessage() {
	const field = useFieldContext();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	console.log({ errors, store: field.store });

	if (errors.length === 0) return null;

	return (
		<Typography variant="small" className="text-destructive">
			{errors.join(", ")}
		</Typography>
	);
}
