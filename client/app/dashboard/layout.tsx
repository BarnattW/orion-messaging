import { redirect } from "next/navigation";

async function fetchUserId() {
	try {
		const response = await fetch("http://35.243.204.21/api/auth/getUserId");
		return response.json();
	} catch (error) {
		console.log(error);
	}
}

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	//const userId = await fetchUserId();
	//if (!userId) {
	//redirect("/auth/login");
	//}

	return (
		<div className="bg-gradient-to-r from-zinc-800 to-neutral-800 h-full min-h-full">
			<div className="flex h-full">{children}</div>
		</div>
	);
}
