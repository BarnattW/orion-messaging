"use client";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import useSWR from "swr";
import { set } from "lodash";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function UserData({ children }: { children: React.ReactNode }) {
	const { userId, setUserId, username, setUsername, setFriends } =
		useContext(UserContext);
	const { data: userIdSWR, error } = useSWR("/api/auth/getUserId", fetcher);
	const { data: usernameSWR } = useSWR(
		userIdSWR ? `/api/users/${userIdSWR}/username` : null,
		fetcher
	);
	const { data: friendsSWR } = useSWR(
		userIdSWR ? `/api/getFriends/${userIdSWR}` : null,
		fetcher
	);

	if (error) {
		console.log(error);
	}

	useEffect(() => {
		if (userIdSWR) {
			setUserId(userIdSWR);
		}
	}, [userIdSWR, setUserId]);

	useEffect(() => {
		if (usernameSWR && friendsSWR) {
			setUsername(usernameSWR);
			setFriends(friendsSWR);
		}
	}, [usernameSWR, setUsername, friendsSWR, setFriends]);

	console.log(userId, username);

	return <>{children}</>;
}
