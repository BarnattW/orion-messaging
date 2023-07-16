import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Snackbar from "../components/Snackbar/Snackbar";
import { UserData } from "../Context/UserData";

async function fetchUserId() {
	try {
		const cookieStore = cookies();
		const userJWT = cookieStore.get("cookie");
		const response = await fetch(
			"http://auth-srv.default.svc.cluster.local:3000/api/auth/getUserId",
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					cookie: userJWT?.value,
				},
			}
		);
		if (!response.ok) {
			throw new Error();
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
	// if (!userId) {
	// 	redirect("/auth/login");
	// }

	return (
		<UserData userId={"a"}>
			<div className="h-full min-h-full bg-zinc-800">
				<div className="flex h-full">
					{children}
					<Snackbar />
				</div>
			</div>
		</UserData>
	);
}
