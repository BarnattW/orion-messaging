"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

import messageSocket from "../sockets/messageSocket";
import { useUserStore } from "../store/userStore";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function UserData({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { userId, setUserId, setUsername, setFriends, setConversations } =
		useUserStore(
			(state) => ({
				userId: state.userId,
				setUserId: state.setUserId,
				setUsername: state.setUsername,
				setFriends: state.setFriends,
				setConversations: state.setConversations,
			}),
			shallow
		);

	const { data: usernameSWR, error } = useSWR(
		userId ? `/api/connect/${userId}/getUsername` : null,
		fetcher
	);

	if (error) {
		console.log(error);
	}

	useEffect(() => {
		async function getUserId() {
			const response = await fetch("/api/auth/getUserId", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(response);
			if (response.status === 401) {
				router.push("/");
			}
			const userId = await response.json();
			setUserId(userId);
		}
		getUserId();
	}, [setUserId, router]);

	console.log(userId);
	useEffect(() => {
		async function getUserData() {
			if (usernameSWR && userId) {
				setUsername(usernameSWR);

				const response = await fetch(`/api/connect/getFriends/${userId}`, {
					headers: {
						method: "GET",
						"Content-Type": "application/json",
					},
				});

				const friends = await response.json();
				setFriends(friends.friends);
			}
		}
		getUserData();
	}, [usernameSWR, setUsername, setFriends, userId, router]);

	useEffect(() => {
		function getUserConversations() {
			if (userId) {
				try {
					messageSocket.emit("getConversations", {
						userId: userId,
					});
					messageSocket.on("gotConversations", (message) => {
						if (message.data) {
							setConversations(message.data);
							console.log(message.data)
						}
					});
				} catch (error) {
					console.log(error);
				}
			}
		}
		getUserConversations();
	}, [setConversations, userId]);

	return <>{children}</>;
}
