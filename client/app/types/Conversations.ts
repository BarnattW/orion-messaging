import { Friend } from "./UserContextTypes";

export interface ConversationCardProps {
	imageUrl?: string;
	altText: string;
	users: Friend[];
	type: string;
	conversationName: string;
	conversationId: string;
	latestMessageTimestamp: Date;
	groupId?: string;
	userData: Friend[];
}
