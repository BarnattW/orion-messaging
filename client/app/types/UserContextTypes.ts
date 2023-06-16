export interface Friend {
	username: string;
	userId: string;
}

export interface Conversation {
	title: string;
	conversationType: string;
	users: string[];
	messages: string[];
	latestMessage: string;
	_id: string;
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
	conversations: Conversation[]; // acts like a cache, {conversationId: message[]}
	setConversations: (conversations: Conversation[]) => void;
}
