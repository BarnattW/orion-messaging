import { useContext } from "react";
import Avatar from "../Avatar/Avatar";
import { ConversationCardProps } from "@/app/types/Conversations";
import { UserContext } from "@/app/Context/UserContext";

function ConversationCard(conversationCardProps: ConversationCardProps) {
	const { setActiveConversation } = useContext(UserContext);
	function changeActiveConversation() {
		setActiveConversation({
			title: conversationCardProps.conversationName,
			conversationId: conversationCardProps.conversationId,
			latestMessageTimestamp: conversationCardProps.latestMessageTimestamp,
		});
	}

	return (
		<div
			className="py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white"
			onClick={changeActiveConversation}
		>
			<div className="flex mx-4 gap-3 items-center">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon-blue.png"
						altText={conversationCardProps.altText}
						type="default"
					/>
				</div>
				<div className="truncate text-sm">
					{conversationCardProps.conversationName}
				</div>
			</div>
		</div>
	);
}

export default ConversationCard;
