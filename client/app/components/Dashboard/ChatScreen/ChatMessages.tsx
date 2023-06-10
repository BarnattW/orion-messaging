"use client";

import { useEffect, useRef, useState } from "react";
import UserMessage from "./ChatScreen/UserMessages";
import { debounce } from "lodash";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import SentMessage from "./ChatScreen/SentMessage";
import useUserMessages from "../../../custom-hooks/useUserMessages";

function ChatMessages() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const { sortedUserMessages, loading } = useUserMessages();

	function scrollToBottom() {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
			setShowScrollButton(false);
		}
	}

	useEffect(() => {
		scrollToBottom();
	}, [sortedUserMessages]);

	const handleScroll = debounce(() => {
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

	if (sortedUserMessages.length === 0) {
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
			{sortedUserMessages.map((message) => {
				return message.renderUserMessage ? (
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
