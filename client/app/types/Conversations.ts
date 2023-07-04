import { MouseEvent } from "react";

import { Friend } from "./UserContextTypes";

export interface SelectedConversation {
	type: string;
	userData: Friend[];
	conversationName: string | undefined;
	conversationId: string;
	groupId?: string;
}

export interface ConversationCardProps {
	imageUrl?: string;
	altText: string;
	type: string;
	conversationName: string;
	conversationId: string;
	latestMessageTimestamp: Date;
	groupId?: string;
	userData: Friend[];
	handleContextMenu: (
		event: MouseEvent<HTMLDivElement>,
		selectedConversation: SelectedConversation
	) => void;
}

export interface ConversationContextMenuProps {
	contextMenuPosition: { x: number; y: number };
	closeContextMenu: () => void;
	selectedConversation: SelectedConversation;
}
