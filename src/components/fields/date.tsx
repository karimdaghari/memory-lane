import {
	DateField as DateFieldRac,
	DateInput,
} from "@/components/ui/datefield-rac";
import { useFieldContext } from "@/hooks/form-context";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { useStore } from "@tanstack/react-form";
import type { DateValue } from "react-aria-components";
import { Typography } from "../typography";
import { Label } from "../ui/label";
import { FormMessage } from "./form-message";

interface DateFieldProps {
	label?: string;
	description?: string;
}

export function DateField({ label, description }: DateFieldProps) {
	const field = useFieldContext<Date | null>();

	const value = useStore(field.store, (state) => {
		const value = state.value;
		if (!value) return null;
		return fromDate(value, getLocalTimeZone());
	});

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<DateFieldRac
				granularity="minute"
				hourCycle={24}
				value={value}
				onChange={(date: DateValue | null) => {
					if (date) {
						const jsDate = date.toDate(getLocalTimeZone());
						field.handleChange(jsDate);
					} else {
						field.handleChange(null);
					}
				}}
			>
				<DateInput />
			</DateFieldRac>
			{description && <Typography variant="muted">{description}</Typography>}
			<FormMessage />
		</div>
	);
}
