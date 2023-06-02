"use client";
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export function UserData({ children }: { children: React.ReactNode }) {
	const { userId, setUserId } = useContext(UserContext);

	useEffect(() => {
		async function fetchData() {
			try {
				// Get the JWT token from your authentication process
				const jwtUserIdResponse = await fetch("/api/auth/getUserId");
				const jwtUserIdData = await jwtUserIdResponse.json();

				setUserId(jwtUserIdData);
				// Fetch user data using the JWT token
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, [setUserId]);

	return <>{children}</>;
}
