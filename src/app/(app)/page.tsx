import { createClient } from "@/supabase/server";
import { Home } from "./_components/home";
import { Welcome } from "./_components/welcome";

export default async function AppPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return <Welcome />;

	return <Home />;
}
