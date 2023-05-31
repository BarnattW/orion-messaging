"use client";

import { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage";
import { dummyMessages } from "@/app/dummy-data/dummy-messages";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

function ChatMessages() {
	const [userMessages, setUserMessages] = useState<Message[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		(async () => {
			try {
				const response: Message[] = await dummyMessages.messages;
				setUserMessages(response);
			} catch (error) {
				console.error("Error retrieving messages:", error);
			}
		})();
	}, []);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
		}
	}, [userMessages]);

	return (
		<div
			className="flex flex-col grow overflow-auto scrollbar-thin scrollbar-thumb-neutral-700"
			ref={scrollRef}
		>
			{userMessages.length === 0 ? (
				<div className="flex items-center justify-center">
					<p>Loading messages...</p>
				</div>
			) : (
				userMessages.map((message) => (
					<UserMessage
						sender={message.sender}
						receiver={message.receiver}
						message={message.message}
						messageId={message.messageId}
						timeStamp={message.timeStamp}
						key={message.messageId}
					/>
				))
			)}
		</div>
	);
}

export default ChatMessages;
