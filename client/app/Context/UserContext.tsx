"use client";
import { createContext, useState } from "react";

import {
	ActiveConversation,
	Conversation,
	Friend,
	Messages,
	UserContextProps,
} from "../types/UserContextTypes";

export const UserContext = createContext<UserContextProps>({
	userId: null,
	setUserId: () => {},
	username: null,
	setUsername: () => {},
	friends: [], // will update to onlineFriends and offlineFriends
	setFriends: () => {},
	activeConversation: null,
	setActiveConversation: () => {},
	conversations: [],
	setConversations: () => {},
	messages: {},
	setMessages: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [activeConversation, setActiveConversation] =
		useState<ActiveConversation | null>(null);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [messages, setMessages] = useState<Messages>({});

	const value = {
		userId,
		setUserId,
		username,
		setUsername,
		friends,
		setFriends,
		activeConversation,
		setActiveConversation,
		conversations,
		setConversations,
		messages,
		setMessages,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
