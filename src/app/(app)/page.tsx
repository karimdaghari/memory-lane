import { createClient } from "@/db/supabase/server";
import { Home } from "./home";
import { WelcomePublic } from "./welcome-public";

export default async function AppPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return <WelcomePublic />;

	return <Home />;
}
