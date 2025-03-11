"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: string;
	values: { value: string; label: string; icon?: React.ReactNode }[];
	onValueChange?: (value: string) => void;
}

export function Tabs({
	className,
	value: defaultValue,
	values,
	onValueChange,
	...props
}: TabsProps) {
	const [activeTab, setActiveTab] = React.useState<string>(
		defaultValue || values[0]?.value || "",
	);

	// Refs for measuring tab elements
	const tabsRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());
	const [indicatorStyle, setIndicatorStyle] = React.useState({
		left: 0,
		width: 0,
		height: 0,
	});

	// Update indicator position when active tab changes
	React.useEffect(() => {
		const activeTabElement = tabsRef.current.get(activeTab);
		if (activeTabElement) {
			const { offsetLeft, offsetWidth, offsetHeight } = activeTabElement;
			setIndicatorStyle({
				left: offsetLeft,
				width: offsetWidth,
				height: offsetHeight,
			});
		}
	}, [activeTab]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		onValueChange?.(value);
	};

	return (
		<div
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 relative",
				className,
			)}
			{...props}
		>
			{/* Sliding indicator */}
			<div
				className="absolute z-0 rounded-md bg-background shadow-sm transition-all duration-300 ease-out"
				style={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
					height: indicatorStyle.height,
					transform: "translateZ(0)", // Hardware acceleration
				}}
			/>

			{values.map((tab) => (
				<button
					type="button"
					key={tab.value}
					ref={(el) => {
						if (el) tabsRef.current.set(tab.value, el);
					}}
					onClick={() => handleTabChange(tab.value)}
					className={cn(
						"relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:mr-2 [&_svg]:text-muted-foreground [&_svg]:size-4",
						activeTab === tab.value
							? "text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{tab.icon && <span>{tab.icon}</span>}
					{tab.label}
				</button>
			))}
		</div>
	);
}
