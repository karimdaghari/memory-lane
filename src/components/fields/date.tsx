import { DateInput } from "@/components/ui/datefield-rac";
import { useFieldContext } from "@/hooks/form-context";
import { parseDate } from "@internationalized/date";
import { useStore } from "@tanstack/react-form";
import { DatePicker, type DateValue, Group } from "react-aria-components";
import { Typography } from "../typography";
import { Label } from "../ui/label";

interface DateFieldProps {
	label?: string;
	description?: string;
}

export function DateField({ label, description }: DateFieldProps) {
	const field = useFieldContext<Date | null>();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	const value = field.state.value
		? parseDate(field.state.value.toISOString().split("T")[0])
		: null;

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<DatePicker
				value={value}
				onChange={(date: DateValue | null) => {
					if (date) {
						const jsDate = new Date(date.toString());
						field.handleChange(jsDate);
					} else {
						field.handleChange(null);
					}
				}}
			>
				<div className="flex">
					<Group className="w-full">
						<DateInput className="pe-9" />
					</Group>
				</div>
			</DatePicker>
			{description && <Typography variant="muted">{description}</Typography>}
			{errors && (
				<Typography variant="small" className="text-destructive">
					{errors.join(", ")}
				</Typography>
			)}
		</div>
	);
}
