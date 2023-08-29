import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { FriendRequests, GroupRequests } from "../types/FriendRequests";
import {
	ActiveConversation,
	ActiveConversationFields,
	Conversation,
	Friend,
	MessageFields,
	Messages,
	Notification,
	Snackbar,
	Users,
} from "../types/UserContextTypes";
import { Queue } from "../utils/Queue";

type UserState = {
	userId: string | null;
	setUserId: (id: string | null) => void;
	username: string | null;
	setUsername: (username: string | null) => void;
	users: Users;
	setUsers: (userId: string, username: string) => void;
	friends: Friend[];
	setFriends: (friends: Friend[]) => void;
	addFriends: (receiverId: string) => void;
	deleteFriends: (receiverId: string) => void;
	friendRequests: FriendRequests;
	setFriendRequests: (friendRequests: FriendRequests) => void;
	deleteReceivedFriendRequest: (receivedFriendRequestId: string) => void;
	deleteSentFriendRequest: (sentFriendRequestId: string) => void;
	groupRequests: GroupRequests;
	setGroupRequests: (groupRequests: GroupRequests) => void;
	deleteReceivedGroupRequest: (receivedGroupRequestId: string) => void;
	deleteSentGroupRequest: (sentGroupRequestId: string) => void;
	activeConversation: ActiveConversation | null;
	setActiveConversation: (
		updatedActiveConversation: ActiveConversationFields
	) => void;
	conversations: Conversation[];
	setConversations: (conversations: Conversation[]) => void;
	updateConversations: (
		updatedConversation: Conversation,
		index: number
	) => void;
	messages: Messages;
	setMessages: (conversationId: string, updatedFields: MessageFields) => void;
	showUserList: boolean;
	setShowUserList: () => void;
	snackbar: Queue<Snackbar>;
	enqueueSnackbar: (newSnackbar: Snackbar) => void;
	setSnackbar: (updatedSnackbar: Queue<Snackbar>) => void;
	currentSnackbar: Snackbar;
	setCurrentSnackbar: (snackbar?: Snackbar) => void;
	notifications: Notification[];
	setNotifications: (notifications: Notification[]) => void;
	deleteNotifications: (notificationId: string) => void;
	toggleNotifications: boolean;
	setToggleNotifications: (toggleNotif: boolean) => void;
};

export const useUserStore = createWithEqualityFn<UserState>(
	(set) => ({
		userId: null,
		setUserId: (id) => set(() => ({ userId: id })),
		username: null,
		setUsername: (username) => set(() => ({ username })),
		users: {},
		setUsers: (userId, username) =>
			set((state) => ({
				users: {
					...state.users,
					[userId]: { username: username },
				},
			})),
		friends: [],
		setFriends: (friends) => set(() => ({ friends })),
		addFriends: (receiverId) =>
			set((state) => {
				const newFriend: Friend = {
					userId: receiverId,
					username: "a",
				};
				return { friends: [...state.friends, newFriend] };
			}),
		deleteFriends: (receiverId) =>
			set((state) => {
				const updatedFriends = state.friends.filter(
					(friend) => friend.userId !== receiverId
				);
				return { friends: [...updatedFriends] };
			}),
		friendRequests: { receivedRequests: [], sentRequests: [] },
		setFriendRequests: (friendRequests) =>
			set((state) => ({ friendRequests: friendRequests })),
		deleteReceivedFriendRequest: (receivedFriendRequestId) =>
			set((state) => {
				const updatedReceivedFriendRequests =
					state.friendRequests.receivedRequests?.filter(
						(friendRequest) => friendRequest._id != receivedFriendRequestId
					);
				return {
					friendRequests: {
						...state.friendRequests,
						receivedRequests: updatedReceivedFriendRequests,
					},
				};
			}),
		deleteSentFriendRequest: (sentFriendRequestId) =>
			set((state) => {
				const updatedSentFriendRequests =
					state.friendRequests.sentRequests?.filter(
						(friendRequest) => friendRequest._id != sentFriendRequestId
					);
				return {
					friendRequests: {
						...state.friendRequests,
						sentRequests: updatedSentFriendRequests,
					},
				};
			}),
		groupRequests: { receivedRequests: [], sentRequests: [] },
		setGroupRequests: (groupRequests) =>
			set((state) => ({ groupRequests: groupRequests })),
		deleteReceivedGroupRequest: (receivedGroupRequestId) =>
			set((state) => {
				const updatedReceivedGroupRequests =
					state.groupRequests.receivedRequests?.filter(
						(groupRequest) => groupRequest._id != receivedGroupRequestId
					);
				return {
					groupRequests: {
						...state.groupRequests,
						receivedRequests: updatedReceivedGroupRequests,
					},
				};
			}),
		deleteSentGroupRequest: (sentGroupRequestId) =>
			set((state) => {
				const updatedSentGroupRequests =
					state.groupRequests.sentRequests?.filter(
						(groupRequest) => groupRequest._id != sentGroupRequestId
					);
				return {
					groupRequests: {
						...state.groupRequests,
						sentRequests: updatedSentGroupRequests,
					},
				};
			}),
		activeConversation: null,
		setActiveConversation: (updatedActiveConversation) =>
			set((state) => ({
				activeConversation: {
					...state.activeConversation,
					...updatedActiveConversation,
				},
			})),
		conversations: [],
		setConversations: (newConversations) =>
			set((state) => ({
				conversations: [...state.conversations, ...newConversations],
			})),
		updateConversations: (updatedConversation, index) => {
			set((state) => {
				const updatedConversations = [...state.conversations];
				updatedConversations[index] = updatedConversation;
				return {
					conversations: updatedConversations,
				};
			});
		},
		messages: {},
		setMessages: (conversationId, updatedFields) =>
			set((state) => ({
				messages: {
					...state.messages,
					[conversationId]: {
						...state.messages[conversationId],
						...updatedFields,
					},
				},
			})),
		showUserList: true,
		setShowUserList: () =>
			set((state) => ({ showUserList: !state.showUserList })),
		snackbar: new Queue<Snackbar>(),
		enqueueSnackbar: (newSnackbar) =>
			set((state) => {
				const updatedSnackbar = new Queue<Snackbar>(state.snackbar);
				updatedSnackbar.offer(newSnackbar);
				return {
					snackbar: updatedSnackbar,
				};
			}),
		setSnackbar: (updatedSnackbar) =>
			set(() => ({ snackbar: new Queue<Snackbar>(updatedSnackbar) })),
		currentSnackbar: { showSnackbar: false, message: null, type: "success" },
		setCurrentSnackbar: (currentSnackbar) =>
			set((state) => ({
				currentSnackbar: { ...state.currentSnackbar, ...currentSnackbar },
			})),
		notifications: [],
		setNotifications: (newNotifications) =>
			set((state) => {
				const notificationsWithDate = newNotifications.map(
					(newNotification) => ({
						...newNotification,
						timestamp: new Date(newNotification.timestamp),
					})
				);

				return {
					notifications: [...state.notifications, ...notificationsWithDate],
				};
			}),
		deleteNotifications: (notificationId) =>
			set((state) => {
				const updatedNotifications = state.notifications.filter(
					(notification) => notification._id !== notificationId
				);
				return { notifications: [...updatedNotifications] };
			}),
		toggleNotifications: true,
		setToggleNotifications: (toogleNotif) =>
			set(() => ({ toggleNotifications: toogleNotif })),
	}),
	shallow
);
