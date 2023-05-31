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
		<div className="h-full w-full sm:w-72 flex flex-col gap-2 border-r-2 border-neutral-700 overflow-auto text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:flex-shrink-0 select-none">
			<div className="text-lg px-5 bg-zinc-800  sticky top-0 pt-8 pb-1 backdrop-blur-lg z-10">
				Messages
			</div>
			<div>
				{conversations.length > 0 &&
					conversations.map((conversation) => {
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
		</div>
	);
}

export default ConversationList;
