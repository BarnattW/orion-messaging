"use client";
import { useEffect } from "react";
import { useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";
import { SelectedConversation } from "@/app/types/Conversations";
import { Request } from "@/app/types/FriendRequests";
import getUsername from "@/app/utils/getUsername";

import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationContextMenu from "./ConversationListItem/ConversationContextMenu";
import ConversationListItem from "./ConversationListItem/ConversationListItem";
import CreateGroupChat from "./CreateGroup/CreateGroupChat";
import ReceivedGroupRequests from "./ReceivedGroupRequests";
import SentGroupRequests from "./SentGroupRequest";

function ConversationList() {
	const {
		conversations,
		groupRequests,
		setGroupRequests,
		userId,
		users,
		setUsers,
	} = useUserStore((state) => ({
		conversations: state.conversations,
		groupRequests: state.groupRequests,
		setGroupRequests: state.setGroupRequests,
		userId: state.userId,
		users: state.users,
		setUsers: state.setUsers,
	}));
	console.log("users", users);
	const [selectedConversation, setSelectedConversation] =
		useState<SelectedConversation | null>(null);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const handleContextMenu = (
		event: React.MouseEvent<HTMLLIElement>,
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

				// update users
				groupRequests.incoming.forEach(async (receivedRequest: Request) => {
					const { senderId } = receivedRequest;
					const senderUsername = await getUsername(senderId);
					setUsers(senderId, senderUsername);
				});
				groupRequests.outgoing.forEach(async (sentRequest: Request) => {
					const { receiverId } = sentRequest;
					const receiverUsername = await getUsername(receiverId);
					setUsers(receiverId, receiverUsername);
				});
			} catch (error) {
				console.log(error);
			}
		}

		getRequests();
	}, [userId, setGroupRequests, setUsers]);

	return (
		<ListContainer>
			{groupRequests.receivedRequests &&
				groupRequests.receivedRequests.length > 0 && (
					<ReceivedGroupRequests
						receivedRequests={groupRequests.receivedRequests}
					/>
				)}
			{groupRequests.sentRequests && groupRequests.sentRequests.length > 0 && (
				<SentGroupRequests sentRequests={groupRequests.sentRequests} />
			)}
			<ListHeading>
				<div className="flex justify-between">
					Messages
					<CreateGroupChat />
				</div>
			</ListHeading>
			<ul className="overflow-y-scroll scrollbar-thin">
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						return (
							<ConversationListItem
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
			</ul>
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
