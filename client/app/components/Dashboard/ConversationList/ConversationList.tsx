"use client";

import { useUserStore } from "@/app/store/userStore";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";
import { shallow } from "zustand/shallow";

function ConversationList() {
	const { conversations } = useUserStore(
		(state) => ({
			conversations: state.conversations,
		}),
		shallow
	);
	return (
		<ListContainer>
			<ListHeading>Messages</ListHeading>
			<div>
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						//const isActive = conversation.conversationId === activeConversationId;

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
			</div>
		</ListContainer>
	);
}

export default ConversationList;
