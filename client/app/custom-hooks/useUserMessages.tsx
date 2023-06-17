import { useContext, useEffect, useState } from "react";
import sortMessagesByTimestamps from "../utils/sortMessagesByTimestamps";
import { UserContext } from "../Context/UserContext";
import messageSocket from "../sockets/messageSocket";
import { Messages, ActiveConversation } from "../types/UserContextTypes";
import { SortedMessage } from "../types/Messages";

const useUserMessages = () => {
	const [sortedUserMessages, setSortedUserMessages] = useState<SortedMessage[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const { activeConversation, setActiveConversation, messages, setMessages } =
		useContext(UserContext);

	useEffect(() => {
		function getMessages() {
			if (activeConversation) {
				try {
					messageSocket.emit("getMessages", {
						conversationId: activeConversation.conversationId,
						timestamp: activeConversation.latestMessageTimestamp,
					});
					messageSocket.on("gotMessages", (socketEvent) => {
						console.log(socketEvent);
						if (socketEvent.data) {
							setMessages((prevMessages: Messages) => {
								const updatedMessages: Messages = {
									...prevMessages,
									[activeConversation.conversationId]:
										socketEvent.data.messages,
								};
								return updatedMessages;
							});
							setSortedUserMessages(
								sortMessagesByTimestamps(socketEvent.data.messages)
							);

							// updates timestamp, or else return null if no active conversation
							setActiveConversation(
								(prevActiveConversation: ActiveConversation | null) => {
									if (prevActiveConversation) {
										const updatedActiveConversation: ActiveConversation = {
											...prevActiveConversation,
											latestMessageTimestamp: socketEvent.data.timestamp,
										};
										return updatedActiveConversation;
									}
									return null;
								}
							);

							setLoading(false);
						}
					});
				} catch (error) {
					console.log(error);
					setLoading(false);
				}
			}
		}
		getMessages();
	}, [activeConversation, setActiveConversation, setMessages]);

	return { loading, sortedUserMessages };
};

export default useUserMessages;
