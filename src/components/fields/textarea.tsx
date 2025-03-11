import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Typography } from "../typography";
import { Label } from "../ui/label";
import type { TextareaProps } from "../ui/textarea";
import { Textarea } from "../ui/textarea";

interface TextareaFieldProps extends TextareaProps {
	label?: string;
	description?: string;
}

export function TextareaField({
	label,
	description,
	...props
}: TextareaFieldProps) {
	const field = useFieldContext<string | null | undefined>();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Textarea
				{...props}
				value={field.state.value ?? undefined}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{description && <Typography variant="muted">{description}</Typography>}
			{errors && (
				<Typography variant="small" className="text-destructive">
					{errors.join(", ")}
				</Typography>
			)}
		</div>
	);
}
