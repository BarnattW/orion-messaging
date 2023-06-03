"use client";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function UserData({ children }: { children: React.ReactNode }) {
	const { userId, setUserId } = useContext(UserContext);
	const { data: userData, error } = useSWR("/api/auth/getUserId", fetcher);

	if (error) {
		console.log(error);
	}

	if (userData) {
		setUserId(userData);
	}

	console.log(userId);

	return <>{children}</>;
}
