"use client";

import { debounce } from "lodash";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import useUserMessages from "@/app/custom-hooks/useUserMessages";
import messageSocket from "@/app/sockets/messageSocket";
import { useUserStore } from "@/app/store/userStore";
import { Message } from "@/app/types/UserContextTypes";
import { findMessageByTimestamps } from "@/app/utils/findMessageByTimestamps";
import sortMessagesByTimestamps from "@/app/utils/sortMessagesByTimestamps";

import ChatDate from "./ChatDate";
import ScrollButton from "./ScrollButton";
import SentMessage from "./SentMessage";
import UserMessages from "./UserMessages";

const renderStateClassName =
	"flex grow items-center justify-center text-center text-xl";

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

	const scrollToBottom = useCallback(() => {
		if (scrollRef.current) {
			const { scrollHeight } = scrollRef.current;
			setShowScrollButton(false);
			scrollRef.current.scrollTo({
				top: scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

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
			if (!socketEvent) {
				return;
			}

			const { message, conversationId } = socketEvent.data;
			if (
				!messages[conversationId] &&
				!messages[conversationId]?.initialLoadComplete
			)
				return;

			const updatedMessages = [
				...(messages[conversationId]?.messages || []),
				message,
			];
			const updatedFields = {
				messages: sortMessagesByTimestamps(
					updatedMessages,
					updatedMessages.length - 1,
					updatedMessages.length
				),
			};
			setMessages(conversationId, updatedFields);

			scrollToBottom();
		};

		messageSocket.on("sentMessage", handleSentMessage);

		return () => {
			messageSocket.off("sentMessage", handleSentMessage);
		};
	}, [setMessages, messages, scrollToBottom]);

	useEffect(() => {
		const handleEditedMessage = (socketEvent: {
			data: { message: Message; conversationId: string };
		}) => {
			if (!socketEvent) {
				return;
			}

			const { message, conversationId } = socketEvent.data;
			if (
				!messages[conversationId] &&
				!messages[conversationId]?.initialLoadComplete
			)
				return;

			// perform binary search then update messages if message is cached
			const messageIndex = findMessageByTimestamps(
				message,
				messages[conversationId].messages
			);
			console.log(messageIndex);
			if (messageIndex !== -1) {
				// @ts-ignore
				const updatedMessages = [...messages[conversationId].messages];
				const currentDatestamp = updatedMessages[messageIndex].renderDatestamp;
				const currentRenderUserMessage =
					updatedMessages[messageIndex].renderUserMessage;
				// @ts-ignore
				updatedMessages[messageIndex] = {
					...message,
					renderUserMessage: currentRenderUserMessage,
					renderDatestamp: currentDatestamp,
				};
				setMessages(conversationId, { messages: updatedMessages });
			} else return;
		};

		messageSocket.on("editedMessage", handleEditedMessage);

		return () => {
			messageSocket.off("editedMessage", handleEditedMessage);
		};
	}, [activeConversation?.conversationId, setMessages, messages]);

	useEffect(() => {
		const handleDeletedMessage = (socketEvent: {
			data: { message: Message; conversationId: string };
		}) => {
			if (!socketEvent) {
				return;
			}

			const { message, conversationId } = socketEvent.data;
			if (
				!messages[conversationId] &&
				!messages[conversationId]?.initialLoadComplete
			)
				return;

			// perform binary search then update messages if message is cached
			const messageIndex = findMessageByTimestamps(
				message,
				messages[conversationId].messages
			);

			if (messageIndex && messageIndex != -1) {
				// @ts-ignore
				messages[conversationId].messages.splice(messageIndex, 1);
				const updatedFields = {
					messages: sortMessagesByTimestamps(
						messages[conversationId].messages,
						messageIndex,
						messageIndex + 1
					),
				};
				setMessages(conversationId, updatedFields);
			} else return;
		};

		messageSocket.on("deletedMessage", handleDeletedMessage);

		return () => {
			messageSocket.off("deletedMessage", handleDeletedMessage);
		};
	}, [activeConversation?.conversationId, setMessages, messages]);

	useEffect(() => {
		function setScrollTop() {
			// sets position of scroll top when swapping between conversations
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
			<div className={renderStateClassName}>
				<p>Start messaging a friend</p>
			</div>
		);
	}

	const conversationMessages =
		messages[activeConversation.conversationId].messages;

	if (conversationMessages?.length === 0) {
		return (
			<div className={renderStateClassName}>
				<p>No messages found. Try sending some!</p>
			</div>
		);
	}

	return (
		<div
			className="flex grow flex-col-reverse overflow-auto scrollbar-thin scrollbar-thumb-neutral-700"
			ref={scrollRef}
			onScroll={handleScroll}
		>
			<div>
				{!messages[activeConversation.conversationId].hasMore && (
					<div className="flex items-center justify-center pb-2 pt-4 text-sm">
						Beginning of messages
					</div>
				)}
				{conversationMessages?.map((message, i) => {
					const isUserMessage = message.renderUserMessage;
					const isConsecutiveMessage = message.renderDatestamp;

					return (
						<Fragment key={message._id}>
							{i === 0 && <div ref={loadMoreMessages}></div>}
							{isConsecutiveMessage && isUserMessage && (
								<ChatDate
									timeStamp={message.timestamp}
									key={message.timestamp.getTime()}
								/>
							)}
							{isUserMessage ? (
								<>
									<div className="pt-3"></div>
									<UserMessages
										senderUsername={message.senderUsername}
										senderId={message.senderId}
										message={message.message}
										_id={message._id}
										timestamp={message.timestamp}
										key={message._id}
									/>
								</>
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
						</Fragment>
					);
				})}
				<ScrollButton
					scrollToBottom={scrollToBottom}
					showScrollButton={showScrollButton}
				/>
			</div>
		</div>
	);
}

export default ChatMessages;
