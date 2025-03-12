import { useFieldContext } from "@/hooks/form-context";
import { Typography } from "../typography";
import { Input, type InputProps } from "../ui/input";
import { Label } from "../ui/label";
import { FormMessage } from "./form-message";

interface TextFieldProps extends InputProps {
	label?: string;
	description?: string;
}

export function TextField({ label, description, ...props }: TextFieldProps) {
	const field = useFieldContext<string | null | undefined>();

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Input
				{...props}
				value={field.state.value ?? undefined}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{description && <Typography variant="muted">{description}</Typography>}
			<FormMessage />
		</div>
	);
}
