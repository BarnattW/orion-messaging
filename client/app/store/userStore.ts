import { create } from "zustand";

import {
	ActiveConversation,
	ActiveConversationFields,
	Conversation,
	Friend,
	MessageFields,
	Messages,
} from "../types/UserContextTypes";

type UserState = {
	userId: string | null;
	setUserId: (id: string | null) => void;
	username: string | null;
	setUsername: (username: string | null) => void;
	friends: Friend[];
	setFriends: (friends: Friend[]) => void;
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
};

export const useUserStore = create<UserState>((set) => ({
	userId: null,
	setUserId: (id) => set(() => ({ userId: id })),
	username: null,
	setUsername: (username) => set(() => ({ username })),
	friends: [],
	setFriends: (friends) => set(() => ({ friends })),
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
}));
