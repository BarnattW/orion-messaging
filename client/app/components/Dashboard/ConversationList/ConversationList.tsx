"use client";
import { useEffect } from "react";
import { useState } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";
import { SelectedConversation } from "@/app/types/Conversations";

import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard/ConversationCard";
import ConversationContextMenu from "./ConversationCard/ConversationContextMenu";
import CreateGroupChat from "./CreateGroup/CreateGroupChat";
import ReceivedGroupRequests from "./ReceivedGroupRequests";

function ConversationList() {
	const { conversations, groupRequests, setGroupRequests, userId } =
		useUserStore(
			(state) => ({
				conversations: state.conversations,
				groupRequests: state.groupRequests,
				setGroupRequests: state.setGroupRequests,
				userId: state.userId,
			}),
			shallow
		);
	const [selectedConversation, setSelectedConversation] =
		useState<SelectedConversation | null>(null);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const handleContextMenu = (
		event: React.MouseEvent<HTMLDivElement>,
		selectedConversation: SelectedConversation
	) => {
		event.preventDefault();
		setSelectedConversation(selectedConversation);
		setContextMenuPosition({ x: event.clientX, y: event.clientY });
		setIsComponentVisible(true);
	};

	const closeContextMenu = () => {
		setSelectedConversation(null);
	};

	// fetch all incoming and outgoing group requests
	useEffect(() => {
		async function getRequests() {
			try {
				const responseGroup = await fetch(
					`/api/connect/${userId}/getGroupReqs`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!responseGroup.ok) {
					// update with common error handling
					console.log(responseGroup);
				}
				const groupRequests = await responseGroup.json();
				setGroupRequests({
					receivedRequests: groupRequests.incoming,
					sentRequests: groupRequests.outgoing,
				});
			} catch (error) {
				console.log(error);
			}
		}

		getRequests();
	}, [userId, setGroupRequests]);

	return (
		<ListContainer>
			{groupRequests.receivedRequests &&
				groupRequests.receivedRequests.length > 0 && (
					<ReceivedGroupRequests
						receivedRequests={groupRequests.receivedRequests}
					/>
				)}
			<ListHeading>
				<div className="flex justify-between">
					Messages
					<CreateGroupChat />
				</div>
			</ListHeading>
			<div className="overflow-y-scroll scrollbar-thin">
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						return (
							<ConversationCard
								altText={conversation.title}
								//imageUrl={conversation.conversationImageUrl}
								key={conversation._id}
								type={conversation.conversationType}
								conversationName={conversation.title}
								conversationId={conversation._id}
								latestMessageTimestamp={conversation.latestMessageTimestamp}
								groupId={conversation.groupId}
								userData={conversation.userData}
								handleContextMenu={handleContextMenu}
							/>
						);
					})}
			</div>
			{selectedConversation?.conversationId && isComponentVisible && (
				<ConversationContextMenu
					contextMenuPosition={contextMenuPosition}
					closeContextMenu={closeContextMenu}
					selectedConversation={selectedConversation}
					ref={ref}
				/>
			)}
		</ListContainer>
	);
}

export default ConversationList;
