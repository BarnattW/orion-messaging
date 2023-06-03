"use client";

import { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessages";
import { dummyMessages } from "@/app/dummy-data/dummy-messages";
import { debounce } from "lodash";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import SentMessage from "./SentMessage";

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
	const [loading, setLoading] = useState(true);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [handleScrollEvent, setHandleScrollEvent] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const response: Message[] = await dummyMessages.messages;
				setUserMessages(response);
				setLoading(false);
			} catch (error) {
				console.error("Error retrieving messages:", error);
				setLoading(false);
			}
		})();
	}, []);

	function scrollToBottom() {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
			setShowScrollButton(false);
			setHandleScrollEvent(false);
			setTimeout(() => {
				setHandleScrollEvent(true);
			}, 500);
		}
	}

	useEffect(() => {
		scrollToBottom();
	}, [userMessages]);

	const handleScroll = debounce(() => {
		if (!handleScrollEvent) {
			return;
		}

		if (
			scrollRef.current &&
			scrollRef.current.scrollTop <
				scrollRef.current.scrollHeight - scrollRef.current.clientHeight - 100
		) {
			setShowScrollButton(true);
		} else {
			setShowScrollButton(false);
		}
	}, 10);

	if (loading) {
		return (
			<div className="flex items-center justify-center grow">
				<p>Loading messages...</p>
			</div>
		);
	}

	if (userMessages.length === 0) {
		return (
			<div className="flex items-center justify-center grow text-center">
				<p>No messages found. Trying sending some!</p>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col grow overflow-auto scrollbar-thin scrollbar-thumb-neutral-700"
			ref={scrollRef}
			onScroll={handleScroll}
		>
			{userMessages.map((message, i) => {
				const renderUserMessage =
					i === 0 || message.sender !== userMessages[i - 1].sender;
				return renderUserMessage ? (
					<UserMessage
						sender={message.sender}
						receiver={message.receiver}
						message={message.message}
						messageId={message.messageId}
						timeStamp={message.timeStamp}
						key={message.messageId}
					/>
				) : (
					<SentMessage
						sender={message.sender}
						receiver={message.receiver}
						message={message.message}
						messageId={message.messageId}
						timeStamp={message.timeStamp}
						key={message.messageId}
						type="consecutiveMessage"
					/>
				);
			})}
			<button
				onClick={scrollToBottom}
				className={
					showScrollButton
						? "absolute bg-gray-100 px-2 py-2 rounded-full text-sm z-20 bottom-20 right-6 hover:bg-gray-300"
						: "hidden"
				}
			>
				<DownArrowIcon />
			</button>
		</div>
	);
}

export default ChatMessages;
