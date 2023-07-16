"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

import messageSocket from "../sockets/messageSocket";
import { useUserStore } from "../store/userStore";
import { Conversation, Friend } from "../types/UserContextTypes";
import getUsername from "../utils/getUsername";

export function UserData({
	children,
	userId,
}: {
	children: React.ReactNode;
	userId: string;
}) {
	const router = useRouter();
	const {
		setUserId,
		setUsername,
		setFriends,
		setConversations,
		users,
		setUsers,
	} = useUserStore(
		(state) => ({
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

	console.log(userId);
	useEffect(() => {
		function settingUserId() {
			if (userId) {
				setUserId(userId);
			}
		}
		settingUserId();
	}, [setUserId, userId]);

	useEffect(() => {
		async function getUserData() {
			if (userId) {
				setUsername(userId);
				setUsers(userId, userId);

				const response = await fetch(`/api/connect/getFriends/${userId}`, {
					headers: {
						method: "GET",
						"Content-Type": "application/json",
					},
				});
				console.log(response);
				const friends = await response.json();
				console.log(friends);
				if (friends.friends) {
					setFriends(friends.friends);
					friends.friends.forEach((friend: Friend) => {
						setUsers(friend.userId, friend.username);
					});
				}
			}
		}
		getUserData();
	}, [setUsername, setFriends, userId, router, setUsers]);

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
