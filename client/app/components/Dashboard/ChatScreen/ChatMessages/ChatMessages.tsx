"use client";

import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import UserMessages from "./UserMessages";
import { debounce } from "lodash";
import DownArrowIcon from "@/app/components/Icons/DownArrowIcon";
import SentMessage from "./SentMessage";
import useUserMessages from "@/app/custom-hooks/useUserMessages";
import ChatDate from "./ChatDate";
import messageSocket from "@/app/sockets/messageSocket";
import { UserContext } from "@/app/Context/UserContext";
import { Messages } from "@/app/types/UserContextTypes";

function ChatMessages() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const { sortedUserMessages, loading } = useUserMessages();
	const { activeConversation, setMessages } = useContext(UserContext);

	messageSocket.on("sentMessage", (socketEvent) => {
		if (socketEvent.data) {
			const { message, conversationId } = socketEvent.data;

			if (!activeConversation) return;

			if (activeConversation.conversationId === conversationId) {
				setMessages((prevMessages: Messages) => {
					let activeMessages = prevMessages[activeConversation.conversationId];
					activeMessages.push(socketEvent.data.message);

					const updatedMessages: Messages = {
						...prevMessages,
						[activeConversation.conversationId]: activeMessages,
					};
					return updatedMessages;
				});
			}
			return;
		}
	});

	function scrollToBottom() {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
			<div className="flex justify-center items-center text-sm pt-4 pb-2">
				Beginning of messages
			</div>
			{sortedUserMessages.map((message) => {
				if (message.renderUserMessage && message.renderDatestamp) {
					return (
						<React.Fragment key={message.timestamp.getTime()}>
							<ChatDate
								timeStamp={message.timestamp}
								key={message.timestamp.getTime()}
							/>
							<UserMessages
								senderUsername={message.senderUsername}
								senderId={message.senderId}
								message={message.message}
								_id={message._id}
								timestamp={message.timestamp}
								key={message._id}
							/>
						</React.Fragment>
					);
				}
				return message.renderUserMessage ? (
					<UserMessages
						senderUsername={message.senderUsername}
						senderId={message.senderId}
						message={message.message}
						_id={message._id}
						timestamp={message.timestamp}
						key={message._id}
					/>
				) : (
					<SentMessage
						senderUsername={message.senderUsername}
						senderId={message.senderId}
						message={message.message}
						_id={message._id}
						timestamp={message.timestamp}
						key={message._id}
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
