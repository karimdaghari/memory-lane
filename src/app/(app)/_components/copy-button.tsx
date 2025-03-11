"use client";

import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
	value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
	const id = useId();
	const [copied, setCopied] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCopy = () => {
		if (inputRef.current) {
			navigator.clipboard.writeText(inputRef.current.value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
			toast.success("Copied to clipboard");
		}
	};

	return (
		<div className="relative w-full">
			<Input
				ref={inputRef}
				id={id}
				className="pe-9 w-full"
				type="text"
				value={value}
				readOnly
			/>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							onClick={handleCopy}
							className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
							disabled={copied}
							type="button"
						>
							<div
								className={cn(
									"transition-all",
									copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
								)}
							>
								<Check
									className="stroke-emerald-500"
									size={16}
									strokeWidth={2}
									aria-hidden="true"
								/>
							</div>
							<div
								className={cn(
									"absolute transition-all",
									copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
								)}
							>
								<Copy size={16} strokeWidth={2} aria-hidden="true" />
							</div>
						</button>
					</TooltipTrigger>
					<TooltipContent className="px-2 py-1 text-xs">
						Copy to clipboard
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
