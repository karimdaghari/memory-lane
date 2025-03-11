import "./styles/globals.css";
import { env } from "@/env/server";
import { TRPCReactProvider } from "@/trpc/client/react";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

const defaultUrl = env.VERCEL_URL
	? `https://${env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Memory Lanes",
	description: "Your personal memory lane",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={geistSans.className} suppressHydrationWarning>
			<body className="bg-accent text-foreground">
				<TRPCReactProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NuqsAdapter>{children}</NuqsAdapter>
						<Toaster richColors position="top-right" closeButton />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
