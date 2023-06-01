import ListContainer from "../ListContainer";
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
			<div className="text-lg px-5 bg-zinc-800  sticky top-0 pt-8 pb-1 backdrop-blur-lg z-10">
				Messages
			</div>
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
