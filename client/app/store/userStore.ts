import { create } from "zustand";
import {
	Friend,
	ActiveConversation,
	ActiveConversationFields,
	Conversation,
	Messages,
	MessageFields,
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
	messages: Messages;
	setMessages: (conversationId: string, updatedFields: MessageFields) => void;
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
	setConversations: (conversations) => set(() => ({ conversations })),
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
}));
