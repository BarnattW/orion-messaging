export interface Friend {
	username: string;
	userId: string;
}

export interface Conversation {
	title: string;
	conversationType: string;
	users: string[];
	messages: string[];
	latestMessageTimestamp: Date;
	_id: string;
}

export interface ActiveConversation {
	title: string;
	conversationId: string;
	latestMessageTimestamp: Date;
}

export interface Message {
	senderId: string;
	senderUsername: string;
	message: string;
	timestamp: Date;
	_id: string;
}

export interface Messages {
	[conversationId: string]: Message[];
}

export interface UserContextProps {
	userId: string | null;
	setUserId: (userId: string | null) => void;
	username: string | null;
	setUsername: (username: string | null) => void;
	friends: Friend[];
	setFriends: (friends: Friend[]) => void;
	activeConversation: ActiveConversation | null;
	setActiveConversation: React.Dispatch<
		React.SetStateAction<ActiveConversation | null>
	>;
	conversations: Conversation[];
	setConversations: (conversations: Conversation[]) => void;
	messages: Messages;
	setMessages: React.Dispatch<React.SetStateAction<Messages>>;
}
