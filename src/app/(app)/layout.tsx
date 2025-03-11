import { Navbar } from "@/components/navbar";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full rounded-lg bg-background h-full p-4">
			<Navbar />
			<main className="p-4 gap-4 flex flex-col lg:container mx-auto">
				{children}
			</main>
		</div>
	);
}
