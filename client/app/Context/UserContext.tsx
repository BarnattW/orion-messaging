import { createContext, useEffect, useState } from "react";

interface friend {
	friend: {
		username: string;
		userId: string;
	};
}

interface UserContextProps {
	authId: string | null;
	userId: string | null;
	username: string | null;
	setUsername: (username: string | null) => void;
	friends: friend[];
	setFriends: (friends: friend[]) => void;
	activeConversation: string | null;
	setActiveConversation: (activeConversation: string | null) => void;
}

export const UserContext = createContext<UserContextProps>({
	authId: null,
	userId: null,
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
	const [username, setUsername] = useState<string | null>(null);
	const [friends, setFriends] = useState<friend[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null
	);

	useEffect(() => {
		const getAuthId = async () => {
			try {
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		getAuthId();
	}, []);

	const value = {
		authId: null,
		userId: null,
		username,
		setUsername,
		friends,
		setFriends,
		activeConversation,
		setActiveConversation,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
