import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserData } from "../Context/UserData";

async function fetchUserId() {
	try {
		const cookieStore = cookies();
		const userJWT = cookieStore.get("cookie");
		console.log(userJWT);
		const response = await fetch(
			"http://auth-srv.default.svc.cluster.local:3000/api/auth/getUserId",
			{
				method: "GET",
				credentials: "include",
				headers: {
					cookie: userJWT?.value,
				},
			}
		);
		console.log(response);
		if (response.status === 401) {
			return;
		}
		const userId = await response.json();
		return userId;
	} catch (error) {
		console.log(error);
	}
}

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const userId = await fetchUserId();
	// console.log(userId);
	// if (!userId) {
	// 	redirect("/auth/login");
	// }

	return (
		<UserData>
			<div className="h-full min-h-full bg-zinc-800">
				<div className="flex h-full">{children}</div>
			</div>
		</UserData>
	);
}
