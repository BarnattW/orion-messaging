export interface ConversationCardProps {
	imageUrl?: string;
	altText: string;
	users: string[];
	type: string;
	conversationName: string;
	conversationId: string;
	latestMessageTimestamp: Date;
}
