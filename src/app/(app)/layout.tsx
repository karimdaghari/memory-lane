import { Navbar } from "@/components/navbar";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-dvh p-6">
			<main className="w-full rounded-lg bg-background h-full p-6 gap-4 flex flex-col">
				<Navbar />
				<div className="overflow-y-auto pr-3">{children}</div>
			</main>
		</div>
	);
}
