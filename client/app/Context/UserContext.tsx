"use client";
import { createContext, useState } from "react";
import {
	UserContextProps,
	Friend,
	Conversation,
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
	conversations: [], // acts like a cache, {conversationId: message[]}
	setConversations: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null
	);
	const [conversations, setConversations] = useState<Conversation[]>([]);

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
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
