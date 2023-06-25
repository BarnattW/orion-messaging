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
	title?: string;
	conversationId: string;
	latestMessageTimestamp: Date;
	hasMore: boolean;
	lastScrollTop: number | null;
	canLoad: boolean;
	initialLoadComplete?: boolean;
}

export interface ActiveConversationFields {
	title?: string;
	conversationId?: string;
	latestMessageTimestamp?: Date;
	hasMore?: boolean;
	lastScrollTop?: number | null;
	canLoad?: boolean;
	initialLoadComplete?: boolean;
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
