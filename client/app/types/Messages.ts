import { Message } from "./UserContextTypes";

export interface SentMessage extends Message {
	type?: string;
}
