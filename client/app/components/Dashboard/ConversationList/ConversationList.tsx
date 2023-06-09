import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";

interface Conversation {
	conversationId: number;
	users: string[];
	conversationImageUrl: string;
	conversationName: string;
	type: string;
}

function ConversationList({
	conversations,
}: {
	conversations: Conversation[];
}) {
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
								key={conversation.conversationId}
								type={conversation.type}
								conversationName={conversation.conversationName}
							/>
						);
					})}
			</div>
		</ListContainer>
	);
}

export default ConversationList;
