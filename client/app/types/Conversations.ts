import { MouseEvent } from "react";



export interface SelectedConversation {
	type: string;
	userData: { userId: string }[];
	conversationName: string | undefined;
	conversationId: string;
	groupId?: string;
}

export interface ConversationListItemProps {
	imageUrl?: string;
	altText: string;
	type: string;
	conversationName: string;
	conversationId: string;
	latestMessageTimestamp: Date;
	groupId?: string;
	userData: { userId: string }[];
	handleContextMenu: (
		event: MouseEvent<HTMLLIElement>,
		selectedConversation: SelectedConversation
	) => void;
}

export interface ConversationContextMenuProps {
	contextMenuPosition: { x: number; y: number };
	closeContextMenu: () => void;
	selectedConversation: SelectedConversation;
}
