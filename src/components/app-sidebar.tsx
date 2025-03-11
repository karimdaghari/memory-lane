import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/client/server";

export async function AppSidebar() {
	const isLoggedIn = await api.users.isLoggedIn();

	if (!isLoggedIn) return null;

	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>My Memory Lanes</SidebarGroupLabel>
					<SidebarGroupContent />
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
