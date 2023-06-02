"use client";
import { createContext, useEffect, useState } from "react";

interface friend {
	friend: {
		username: string;
		userId: string;
	};
}

interface UserContextProps {
	userId: string | null;
	setUserId: (userId: string | null) => void;
	username: string | null;
	setUsername: (username: string | null) => void;
	friends: friend[];
	setFriends: (friends: friend[]) => void;
	activeConversation: string | null;
	setActiveConversation: (activeConversation: string | null) => void;
}

export const UserContext = createContext<UserContextProps>({
	userId: null,
	setUserId: () => {},
	username: null,
	setUsername: () => {},
	friends: [], // will update to onlineFriends and offlineFriends
	setFriends: () => {},
	activeConversation: null,
	setActiveConversation: () => {},
	//conversationData: {}, // acts like a cache, {conversationId: message[]}
	//setConversationData: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [friends, setFriends] = useState<friend[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null
	);

	const value = {
		userId,
		setUserId,
		username,
		setUsername,
		friends,
		setFriends,
		activeConversation,
		setActiveConversation,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
