import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { useFieldContext } from "@/hooks/form-context";
import { parseDate } from "@internationalized/date";
import { useStore } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import {
	Button,
	DatePicker,
	type DateValue,
	Dialog,
	Group,
	Popover,
} from "react-aria-components";
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
					<Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
						<CalendarIcon size={16} />
					</Button>
				</div>
				<Popover
					className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
					offset={4}
				>
					<Dialog className="max-h-[inherit] overflow-auto p-2">
						<Calendar />
					</Dialog>
				</Popover>
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
