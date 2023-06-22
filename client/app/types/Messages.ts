import { Message } from "./UserContextTypes";

export interface SortedMessage extends Message {
	renderUserMessage: boolean;
	renderDatestamp: boolean;
}

export interface SentMessage extends Message {
	type?: string;
}
