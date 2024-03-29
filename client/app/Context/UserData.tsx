"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import messageSocket from "../sockets/messageSocket";
import notificationSocket from "../sockets/notificationSocket";
import { useUserStore } from "../store/userStore";
import { Conversation, Friend, Notification } from "../types/UserContextTypes";
import getUsername from "../utils/getUsername";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

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
		setNotifications,
		setToggleNotifications,
	} = useUserStore((state) => ({
		setUserId: state.setUserId,
		setUsername: state.setUsername,
		setFriends: state.setFriends,
		setConversations: state.setConversations,
		users: state.users,
		setUsers: state.setUsers,
		setNotifications: state.setNotifications,
		setToggleNotifications: state.setToggleNotifications,
	}));
	console.log(users);

	const { data: usernameSWR, error } = useSWR(
		userId ? `/api/connect/${userId}/getUsername` : null,
		fetcher
	);

	if (error) {
		console.log(error);
	}

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
		messageSocket.emit("userId", userId);
		notificationSocket.emit("userId", userId);

		return () => {
			messageSocket.off("userId");
			notificationSocket.off("userId");
		};
	}, [userId]);

	useEffect(() => {
		notificationSocket.on("cached", (socketEvent) => {
			socketEvent.forEach(async (notification: Notification) => {
				const username = await getUsername(notification.senderId);
				setUsers(notification.senderId, username);
			});
			setNotifications(socketEvent);
		});

		return () => {
			notificationSocket.off("cached");
		};
	}, [setNotifications, setUsers]);

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
				if (friends.friends) {
					setFriends(friends.friends);
					friends.friends.forEach((friend: Friend) => {
						setUsers(friend.userId, friend.username);
					});
				}
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

	useEffect(() => {
		function receiveUserNotificationSettings() {
			try {
				notificationSocket.emit("getPreferences", userId);
				notificationSocket.on("preferences", (toggleNotifications: boolean) => {
					console.log("toggle notifications:", toggleNotifications);
					setToggleNotifications(toggleNotifications);
				});
			} catch (error) {
				console.log(error);
			}
		}
		receiveUserNotificationSettings();
	}, [setToggleNotifications, userId]);

	return <>{children}</>;
}
