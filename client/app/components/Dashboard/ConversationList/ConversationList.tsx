"use client";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import messageSocket from "@/app/sockets/messageSocket";
import { useUserStore } from "@/app/store/userStore";
import { Conversation } from "@/app/types/UserContextTypes";

import AddIcon from "../../Icons/AddIcon";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";
import CreateGroupChat from "./CreateGroupChat";

const iconClassNames: string = "fill-gray-100 h-7 w-7 hover:cursor-pointer";

function ConversationList() {
	const { conversations, setConversations } = useUserStore(
		(state) => ({
			conversations: state.conversations,
			setConversations: state.setConversations,
		}),
		shallow
	);
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const toggleCreateGroup = () => {
		setIsComponentVisible((prevBool) => !prevBool);
	};
	console.log(conversations);

	useEffect(() => {
		function receiveUserConversationsUpdates() {
			try {
				messageSocket.on(
					"createdConversation",
					(conversation: { data: Conversation }) => {
						if (conversation.data) {
							setConversations(conversation.data);
						}
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
		receiveUserConversationsUpdates();
	}, [setConversations]);

	return (
		<ListContainer>
			<ListHeading>
				<div className="flex justify-between">
					Messages
					<div className="relative" ref={ref}>
						<div onClick={toggleCreateGroup}>
							<AddIcon className={iconClassNames} />
						</div>
						{isComponentVisible && (
							<CreateGroupChat setIsComponentVisible={setIsComponentVisible} />
						)}
					</div>
				</div>
			</ListHeading>
			<div className="overflow-y-scroll scrollbar-thin">
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						return (
							<ConversationCard
								altText={conversation.title}
								//imageUrl={conversation.conversationImageUrl}
								users={conversation.users}
								key={conversation._id}
								type={conversation.conversationType}
								conversationName={conversation.title}
								conversationId={conversation._id}
								latestMessageTimestamp={conversation.latestMessageTimestamp}
							/>
						);
					})}
				<ConversationCard
					altText="vany"
					//imageUrl={conversation.conversationImageUrl}
					users={["vany"]}
					type="group"
					conversationName="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
					conversationId="vany"
					latestMessageTimestamp={new Date()}
				/>
			</div>
		</ListContainer>
	);
}

export default ConversationList;
