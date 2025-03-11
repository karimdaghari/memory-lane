import { MemoryCardEdit } from "@/app/(app)/_components/memory";
import { NewIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { createClient } from "@/db/supabase/server";
import { ThemeSwitcher } from "../theme-switcher";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { SignInButton } from "./sign-in-button";
import { SignUpButton } from "./sign-up-button";
import { UserMenu } from "./user-menu";

export async function Navbar() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<nav className="flex items-center justify-between">
			<div className="flex items-center gap-1">
				<Logo />
				{user ? (
					<>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<SidebarTrigger />
								</TooltipTrigger>
								<TooltipContent side="bottom">Toggle sidebar</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<MemoryCardEdit title="New Memory Lane">
										<Button variant="ghost" size="sm">
											<NewIcon />
										</Button>
									</MemoryCardEdit>
								</TooltipTrigger>
								<TooltipContent side="right">
									Create a new memory lane
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</>
				) : null}
			</div>

			<div className="flex items-center gap-2">
				<ThemeSwitcher />
				{user ? (
					<UserMenu />
				) : (
					<>
						<SignUpButton />
						<SignInButton />
					</>
				)}
			</div>
		</nav>
	);
}
