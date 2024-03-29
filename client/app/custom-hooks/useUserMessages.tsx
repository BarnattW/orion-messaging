import { useEffect, useRef, useState } from "react";

import messageSocket from "../sockets/messageSocket";
import { useUserStore } from "../store/userStore";
import sortMessagesByTimestamps from "../utils/sortMessagesByTimestamps";

const useUserMessages = () => {
	const [loading, setLoading] = useState(true);
	const latestTimestampRef = useRef<Date | null>(null);
	const { activeConversation, setActiveConversation, messages, setMessages } =
		useUserStore((state) => ({
			activeConversation: state.activeConversation,
			setActiveConversation: state.setActiveConversation,
			messages: state.messages,
			setMessages: state.setMessages,
		}));

	useEffect(() => {
		async function getMessages() {
			if (
				activeConversation?.conversationId &&
				activeConversation.hasMore &&
				activeConversation.canLoad
			) {
				setLoading(true);
				try {
					await messageSocket.emit("getMessages", {
						conversationId: activeConversation.conversationId,
						timestamp: activeConversation.latestMessageTimestamp,
					});
				} catch (error) {
					console.log(error);
				}
			}
		}

		getMessages();
	}, [
		activeConversation?.conversationId,
		activeConversation?.latestMessageTimestamp,
		activeConversation?.hasMore,
		activeConversation?.canLoad,
	]);

	useEffect(() => {
		async function handleGotMessages() {
			if (!activeConversation?.conversationId) return;

			try {
				await messageSocket.on("gotMessages", (socketEvent) => {
					const activeConversationId = activeConversation.conversationId;

					if (!socketEvent.data) return;
					console.log(socketEvent.data);
					const latestTimestamp = socketEvent.data.timestamp;

					const messagesArray = messages[activeConversationId]?.messages ?? [];
					const messagesLength = messagesArray.length;
					const additionalIndex = messagesLength > 0 ? 1 : 0;
					const updatedFields = {
						messages: sortMessagesByTimestamps(
							[
								...socketEvent.data.messages,
								...(messages[activeConversationId]?.messages || []),
							],
							0,
							socketEvent.data.messages.length + additionalIndex
						),
						hasMore: socketEvent.data.hasMore,
						latestMessageTimestamp: latestTimestamp,
						initialLoadComplete: true,
					};
					setMessages(activeConversationId, updatedFields);

					if (socketEvent.data.hasMore === false) {
						const updatedActiveConversationFields = {
							hasMore: socketEvent.data.hasMore,
							latestMessageTimestamp: latestTimestamp,
						};
						setActiveConversation(updatedActiveConversationFields);
					}
				});

				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		}
		handleGotMessages();

		return () => {
			messageSocket.off("gotMessages");
		};
	}, [
		activeConversation?.conversationId,
		activeConversation?.latestMessageTimestamp,
		setActiveConversation,
		setMessages,
		messages,
	]);

	return { loading, latestTimestampRef };
};

export default useUserMessages;
