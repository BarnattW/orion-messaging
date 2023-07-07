"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

import messageSocket from "../sockets/messageSocket";
import { useUserStore } from "../store/userStore";
import { Conversation, Friend } from "../types/UserContextTypes";
import getUsername from "../utils/getUsername";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function UserData({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const {
		userId,
		setUserId,
		setUsername,
		setFriends,
		setConversations,
		users,
		setUsers,
	} = useUserStore(
		(state) => ({
			userId: state.userId,
			setUserId: state.setUserId,
			setUsername: state.setUsername,
			setFriends: state.setFriends,
			setConversations: state.setConversations,
			users: state.users,
			setUsers: state.setUsers,
		}),
		shallow
	);
	console.log(users);

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

			if (response.status === 401) {
				router.push("/auth/login");
			}
			const userId = await response.json();
			setUserId(userId);
			messageSocket.emit("userId", userId);
		}
		getUserId();
	}, [setUserId, router]);

	console.log(userId);

	useEffect(() => {
		async function getUserData() {
			if (usernameSWR && userId) {
				setUsername(usernameSWR);
				setUsers(userId, usernameSWR);

				const response = await fetch(`/api/connect/getFriends/${userId}`, {
					headers: {
						method: "GET",
						"Content-Type": "application/json",
					},
				});

				const friends = await response.json();
				setFriends(friends.friends);
				friends.friends.forEach((friend: Friend) => {
					setUsers(friend.userId, friend.username);
				});
			}
		}
		getUserData();
	}, [usernameSWR, setUsername, setFriends, userId, router, setUsers]);

	useEffect(() => {
		async function getUserConversations() {
			if (userId != null) {
				try {
					messageSocket.emit("getConversations", {
						userId: userId,
					});
					messageSocket.on("gotConversations", async (conversation) => {
						if (conversation.data) {
							setConversations(conversation.data);

							for (const data of conversation.data) {
								for (const { userId } of data.userData) {
									if (userId in users) {
										continue;
									}
									try {
										const username = await getUsername(userId);
										setUsers(userId, username);
									} catch (error) {
										console.log(
											`Error retrieving username for userId: ${userId}`,
											error
										);
										// Handle the error, e.g., show an error message to the user
									}
								}
							}
						}
					});
				} catch (error) {
					console.log(error);
				}
			}
		}
		getUserConversations();
	}, [setConversations, userId, setUsers]);

	useEffect(() => {
		function receiveUserConversationsUpdates() {
			try {
				// when adding a group
				messageSocket.on(
					"createdConversation",
					(conversation: { data: Conversation }) => {
						console.log(conversation);
						if (conversation.data) {
							setConversations([conversation.data]);
							conversation.data.userData.forEach(async (userData) => {
								const { userId } = userData;
								if (userId in users) return;
								try {
									const username = await getUsername(userId);
									setUsers(userId, username);
								} catch (error) {
									console.log(
										`Error retrieving username for userId: ${userId}`,
										error
									);
									// Handle the error, e.g., show an error message to the user
								}
							});
						}
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
		receiveUserConversationsUpdates();
	}, [setConversations, setUsers]);

	return <>{children}</>;
}
