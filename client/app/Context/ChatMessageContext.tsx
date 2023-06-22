"use client";
import { createContext, useState } from "react";
import { SortedMessage, ChatMessageProps } from "../types/Messages";

export const ChatMessageContext = createContext<ChatMessageProps>({
	sortedUserMessages: [],
	setSortedUserMessages: () => {},
});

export function ChatMessageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sortedUserMessages, setSortedUserMessages] = useState<SortedMessage[]>(
		[]
	);

	const value = {
		sortedUserMessages,
		setSortedUserMessages,
	};
	return (
		<ChatMessageContext.Provider value={value}>
			{children}
		</ChatMessageContext.Provider>
	);
}
