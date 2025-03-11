import { createClient } from "@/db/supabase/server";
import { Home } from "./home";
import { Welcome } from "./welcome";

export default async function AppPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return <Welcome />;

	return <Home />;
}
