export interface Users {
	[userId: string]: { username: string };
}
export interface Friend {
	username: string;
	userId: string;
}

export interface Conversation {
	title: string;
	groupId?: string;
	conversationType: string;
	messages: string[];
	latestMessageTimestamp: Date;
	_id: string;
	userData: { userId: string }[];
}

export interface ActiveConversation {
	title?: string;
	conversationId: string;
	latestMessageTimestamp: Date;
	hasMore: boolean;
	lastScrollTop: number | null;
	canLoad: boolean;
	initialLoadComplete?: boolean;
	users: { userId: string }[];
	groupId?: string;
}

export interface ActiveConversationFields {
	title?: string;
	conversationId?: string;
	latestMessageTimestamp?: Date;
	hasMore?: boolean;
	lastScrollTop?: number | null;
	canLoad?: boolean;
	initialLoadComplete?: boolean;
	users?: { userId: string }[];
	groupId?: string;
}

export interface Message {
	senderId: string;
	senderUsername: string;
	message: string;
	timestamp: Date;
	_id: string;
	renderUserMessage?: boolean;
	renderDatestamp?: boolean;
}

export interface Messages {
	[conversationId: string]: {
		messages?: Message[];
		hasMore?: boolean | null;
		latestMessageTimestamp?: Date;
		lastScrollTop?: number | null;
		initialLoadComplete?: boolean;
	};
}

export interface MessageFields {
	messages?: Message[];
	hasMore?: boolean | null;
	latestMessageTimestamp?: Date | null;
	lastScrollTop?: number | null;
	initialLoadComplete?: boolean;
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
