import { useEffect, useState } from "react";
import { dummyMessages } from "@/app/dummy-data/dummy-messages";
import sortMessagesByTimestamps from "../utils/sortMessagesByTimestamps";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

interface SortedMessage extends Message {
	renderUserMessage: boolean;
	renderDatestamp: boolean;
}

const useUserMessages = () => {
	const [sortedUserMessages, setSortedUserMessages] = useState<SortedMessage[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getMessages() {
			try {
				const response: Message[] = await dummyMessages.messages;
				setSortedUserMessages(sortMessagesByTimestamps(response));
				setLoading(false);
			} catch (error) {
				console.error("Error retrieving messages:", error);
				setLoading(false);
			}
		}
		getMessages();
	}, []);

	return { loading, sortedUserMessages };
};

export default useUserMessages;
