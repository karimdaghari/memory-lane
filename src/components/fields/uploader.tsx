import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Dropzone } from "../dropzone";
import { Typography } from "../typography";
import { Label } from "../ui/label";

interface UploaderFieldProps {
	label?: string;
	description?: string;
	maxSize?: number;
	className?: string;
}

export function UploaderField({
	label,
	description,
	maxSize,
	className,
}: UploaderFieldProps) {
	const field = useFieldContext<string | null | undefined>();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Dropzone
				onImageChange={(url) => field.handleChange(url)}
				maxSize={maxSize}
				className={className}
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
