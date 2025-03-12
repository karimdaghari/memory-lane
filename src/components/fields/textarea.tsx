import { useFieldContext } from "@/hooks/form-context";
import { Typography } from "../typography";
import { Label } from "../ui/label";
import type { TextareaProps } from "../ui/textarea";
import { Textarea } from "../ui/textarea";
import { FormMessage } from "./form-message";

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

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Textarea
				{...props}
				value={field.state.value ?? undefined}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{description && <Typography variant="muted">{description}</Typography>}
			<FormMessage />
		</div>
	);
}
