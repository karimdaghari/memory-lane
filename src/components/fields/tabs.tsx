import { useFieldContext } from "@/hooks/form-context";
import { Typography } from "../typography";
import { Label } from "../ui/label";
import { Tabs, type TabsProps } from "../ui/tabs";
import { FormMessage } from "./form-message";

interface TabsFieldProps extends TabsProps {
	label?: string;
	description?: string;
}

export function TabsField({ label, description, ...props }: TabsFieldProps) {
	const field = useFieldContext<string | null | undefined>();

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Tabs
				{...props}
				value={field.state.value ?? undefined}
				onValueChange={(value) => field.handleChange(value)}
			/>
			{description && <Typography variant="muted">{description}</Typography>}
			<FormMessage />
		</div>
	);
}
