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
		userIdSWR ? `/api/connect/${userIdSWR}/getUsername` : null,
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
		async function getUserData() {
			if (usernameSWR) {
				setUsername(usernameSWR);

				const response = await fetch(`/api/connect/getFriends/${userIdSWR}`, {
					headers: {
						method: "GET",
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					return;
				}
				const friends = await response.json();
				setFriends(friends.friends);
			}
		}
		getUserData();
	}, [usernameSWR, setUsername, setFriends, userIdSWR]);

	console.log(userId, username);

	return <>{children}</>;
}
