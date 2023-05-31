"use client";

import { useEffect, useState } from "react";
import UserMessage from "./UserMessage";
import { dummyMessages } from "@/app/dummy-data/dummy-messages";

interface message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

function ChatMessages() {
	const [userMessages, setUserMessages] = useState<message[]>([]);
	useEffect(() => {
		async function getMessages(userId: string) {
			const response: message[] = await dummyMessages.messages;
			setUserMessages(response);
			return;
		}
		getMessages("121");
	}, []);

	return (
		<div className="flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-neutral-700">
			{userMessages &&
				userMessages.map((message) => {
					return (
						<UserMessage
							sender={message.sender}
							receiver={message.receiver}
							message={message.message}
							messageId={message.messageId}
							timeStamp={message.timeStamp}
							key={message.messageId}
						/>
					);
				})}
		</div>
	);
}

export default ChatMessages;
