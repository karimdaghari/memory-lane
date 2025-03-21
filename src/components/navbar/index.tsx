import { Logo } from "@/components/logo";
import { createClient } from "@/supabase/server";
import { ThemeSwitcher } from "../theme-switcher";
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
			<Logo />

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
