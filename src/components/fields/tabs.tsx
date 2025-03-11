import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Typography } from "../typography";
import { Label } from "../ui/label";
import { Tabs, type TabsProps } from "../ui/tabs";

interface TabsFieldProps extends TabsProps {
	label?: string;
	description?: string;
}

export function TabsField({ label, description, ...props }: TabsFieldProps) {
	const field = useFieldContext<string | null | undefined>();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Tabs
				{...props}
				value={field.state.value ?? undefined}
				onValueChange={(value) => field.handleChange(value)}
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
