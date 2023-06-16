"use client";

import { useContext } from "react";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";
import { UserContext } from "@/app/Context/UserContext";

function ConversationList() {
	const { conversations } = useContext(UserContext);
	return (
		<ListContainer>
			<ListHeading>Messages</ListHeading>
			<div>
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						//const isActive = conversation.conversationId === activeConversationId;

						return (
							<ConversationCard
								altText={"Conversation"}
								//imageUrl={conversation.conversationImageUrl}
								users={conversation.users}
								key={conversation._id}
								type={conversation.conversationType}
								conversationName={conversation.title}
							/>
						);
					})}
			</div>
		</ListContainer>
	);
}

export default ConversationList;
