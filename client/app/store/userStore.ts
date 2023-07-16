import { create } from "zustand";

import { FriendRequests, GroupRequests } from "../types/FriendRequests";
import {
	ActiveConversation,
	ActiveConversationFields,
	Conversation,
	Friend,
	MessageFields,
	Messages,
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
	friendRequests: FriendRequests;
	setFriendRequests: (friendRequests: FriendRequests) => void;
	groupRequests: GroupRequests;
	setGroupRequests: (groupRequests: GroupRequests) => void;
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
	setSnackbar: (updatedSnackbar: Queue<Snackbar>) => void;
	currentSnackbar: Snackbar;
	setCurrentSnackbar: (snackbar?: Snackbar) => void;
};

export const useUserStore = create<UserState>((set) => ({
	userId: null,
	setUserId: (id) => set(() => ({ userId: id })),
	username: null,
	setUsername: (username) => set(() => ({ username })),
	users: {},
	setUsers: (userId, username) =>
		set((state) => ({
			users: { ...state.users, [userId]: { username } },
		})),
	friends: [],
	setFriends: (friends) => set(() => ({ friends })),
	friendRequests: { receivedRequests: [], sentRequests: [] },
	setFriendRequests: (friendRequests) =>
		set((state) => ({ friendRequests: friendRequests })),
	groupRequests: { receivedRequests: [], sentRequests: [] },
	setGroupRequests: (groupRequests) =>
		set((state) => ({ groupRequests: groupRequests })),
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
	setSnackbar: (updatedSnackbar) =>
		set(() => ({ snackbar: new Queue<Snackbar>(updatedSnackbar) })),
	currentSnackbar: { showSnackbar: false, message: null, type: "success" },
	setCurrentSnackbar: (currentSnackbar) =>
		set((state) => ({
			currentSnackbar: { ...state.currentSnackbar, ...currentSnackbar },
		})),
}));
