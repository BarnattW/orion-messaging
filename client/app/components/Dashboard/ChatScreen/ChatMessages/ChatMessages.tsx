"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import React from "react";
import UserMessages from "./UserMessages";
import { debounce } from "lodash";
import DownArrowIcon from "@/app/components/Icons/DownArrowIcon";
import SentMessage from "./SentMessage";
import useUserMessages from "@/app/custom-hooks/useUserMessages";
import ChatDate from "./ChatDate";
import messageSocket from "@/app/sockets/messageSocket";
import { Message } from "@/app/types/UserContextTypes";
import sortMessagesByTimestamps from "@/app/utils/sortMessagesByTimestamps";
import { useUserStore } from "@/app/store/userStore";
import { shallow } from "zustand/shallow";

function ChatMessages() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const { loading, latestTimestampRef } = useUserMessages();
	const { activeConversation, setActiveConversation, setMessages, messages } =
		useUserStore(
			(state) => ({
				activeConversation: state.activeConversation,
				setActiveConversation: state.setActiveConversation,
				setMessages: state.setMessages,
				messages: state.messages,
			}),
			shallow
		);

	console.log("messages: ", messages, activeConversation);

	const observer = useRef<IntersectionObserver>();
	const loadMoreMessages = useCallback(
		(node: Element | null) => {
			if (
				!activeConversation?.conversationId ||
				loading ||
				!messages[activeConversation.conversationId]?.hasMore
			) {
				return;
			}

			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					messages[activeConversation.conversationId].hasMore
				) {
					console.log("updaing timestamps", entries);
					if (
						messages[activeConversation.conversationId].latestMessageTimestamp
					) {
						setActiveConversation({
							latestMessageTimestamp:
								messages[activeConversation.conversationId]
									.latestMessageTimestamp,
						});

						const updatedFields = {
							latestMessageTimestamp: latestTimestampRef.current,
						};
						setMessages(activeConversation.conversationId, updatedFields);
					}
					setActiveConversation({ canLoad: true });
				}
			});
			if (node) observer.current.observe(node);
		},
		[
			loading,
			activeConversation?.conversationId,
			messages,
			setActiveConversation,
			latestTimestampRef,
			setMessages,
		]
	);

	useEffect(() => {
		const handleSentMessage = (socketEvent: {
			data: { message: Message; conversationId: string };
		}) => {
			if (!socketEvent || !activeConversation?.conversationId) {
				return;
			}

			const { message, conversationId } = socketEvent.data;
			const activeConversationId = activeConversation.conversationId;

			if (activeConversationId !== conversationId) {
				return;
			}

			const updatedMessages = [
				...(messages[activeConversationId]?.messages || []),
				message,
			];
			const updatedFields = {
				messages: sortMessagesByTimestamps(updatedMessages),
			};
			setMessages(activeConversationId, updatedFields);

			scrollToBottom();
		};

		messageSocket.on("sentMessage", handleSentMessage);

		return () => {
			messageSocket.off("sentMessage", handleSentMessage);
		};
	}, [activeConversation?.conversationId, setMessages, messages]);

	function scrollToBottom() {
		if (scrollRef.current) {
			const { scrollHeight } = scrollRef.current;
			setShowScrollButton(false);
			scrollRef.current.scrollTo({
				top: scrollHeight,
				behavior: "smooth",
			});
		}
	}

	useEffect(() => {
		function setScrollTop() {
			const activeConversationId = activeConversation?.conversationId;
			if (!activeConversationId) return;

			if (!activeConversation.initialLoadComplete) return;

			if (scrollRef.current && activeConversation.lastScrollTop) {
				scrollRef.current.scrollTop = activeConversation.lastScrollTop;
			}
		}
		setScrollTop();
	}, [
		activeConversation?.conversationId,
		activeConversation?.lastScrollTop,
		activeConversation?.initialLoadComplete,
	]);

	const handleScroll = debounce(() => {
		if (!activeConversation?.conversationId) {
			return;
		}

		// show scroll button
		if (scrollRef.current && scrollRef.current.scrollTop < -100) {
			setShowScrollButton(true);
		} else {
			setShowScrollButton(false);
		}

		// update scroll height for messages
		if (scrollRef.current != null) {
			const updatedFields = {
				lastScrollTop: scrollRef.current.scrollTop,
			};
			setMessages(activeConversation.conversationId, updatedFields);
		}
	}, 10);

	// render states
	if (activeConversation == null) {
		return (
			<div className="flex items-center justify-center grow text-center">
				<p>Start messaging a friend</p>
			</div>
		);
	}

	const conversationMessages =
		messages[activeConversation.conversationId].messages;

	if (conversationMessages?.length === 0) {
		return (
			<div className="flex items-center justify-center grow text-center">
				<p>No messages found. Try sending some!</p>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col-reverse grow overflow-auto scrollbar-thin scrollbar-thumb-neutral-700"
			ref={scrollRef}
			onScroll={handleScroll}
		>
			<div className="">
				{!messages[activeConversation.conversationId].hasMore && (
					<div className="flex justify-center items-center text-sm pt-4 pb-2">
						Beginning of messages
					</div>
				)}
				{conversationMessages?.map((message, i) => {
					const isUserMessage = message.renderUserMessage;
					const isConsecutiveMessage = message.renderDatestamp;

					return (
						<React.Fragment key={message.timestamp.getTime()}>
							{i === 0 && <div ref={loadMoreMessages}></div>}
							{isConsecutiveMessage && isUserMessage && (
								<ChatDate
									timeStamp={message.timestamp}
									key={message.timestamp.getTime()}
								/>
							)}
							{isUserMessage ? (
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
							)}
						</React.Fragment>
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
		</div>
	);
}

export default ChatMessages;
