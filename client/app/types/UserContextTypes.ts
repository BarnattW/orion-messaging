export interface Friend {
	username: string;
	userId: string;
}

export interface UserContextProps {
	userId: string | null;
	setUserId: (userId: string | null) => void;
	username: string | null;
	setUsername: (username: string | null) => void;
	friends: Friend[];
	setFriends: (friends: Friend[]) => void;
	activeConversation: string | null;
	setActiveConversation: (activeConversation: string | null) => void;
}
