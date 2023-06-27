import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { ConversationCardProps } from "@/app/types/Conversations";

import Avatar from "../Avatar/Avatar";

function ConversationCard({
	conversationId,
	type,
	users,
	conversationName,
	latestMessageTimestamp,
}: ConversationCardProps) {
	const {
		activeConversation,
		setActiveConversation,
		userId,
		messages,
		setMessages,
	} = useUserStore(
		(state) => ({
			activeConversation: state.activeConversation,
			setActiveConversation: state.setActiveConversation,
			userId: state.userId,
			messages: state.messages,
			setMessages: state.setMessages,
		}),
		shallow
	);
	const conversationTitle =
		type === "individual" ? users.find((id) => id != userId) : conversationName;

	console.log(conversationTitle);

	function changeActiveConversation() {
		if (activeConversation?.conversationId != conversationId) {
			if (
				messages[conversationId] != undefined &&
				messages[conversationId].latestMessageTimestamp != null
			) {
				// messages are already cached
				setActiveConversation({
					title: conversationTitle,
					conversationId: conversationId,
					latestMessageTimestamp: messages[conversationId]
						.latestMessageTimestamp as Date,
					hasMore: messages[conversationId].hasMore as boolean,
					lastScrollTop: messages[conversationId].lastScrollTop,
					canLoad: !messages[conversationId].initialLoadComplete,
					initialLoadComplete: messages[conversationId].initialLoadComplete,
				});
			} else {
				// initialize messages and activeConversation
				setActiveConversation({
					title: conversationTitle,
					conversationId: conversationId,
					latestMessageTimestamp: latestMessageTimestamp,
					hasMore: true,
					lastScrollTop: null,
					canLoad: true,
					initialLoadComplete: false,
				});

				const updatedFields = {
					messages: [],
					latestMessageTimestamp: latestMessageTimestamp,
					hasMore: true,
					lastScrollTop: null,
					initialLoadComplete: false,
				};
				setMessages(conversationId, updatedFields);
			}
		}
	}

	return (
		<div
			className={`py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white ${
				activeConversation?.conversationId === conversationId
					? "bg-zinc-600"
					: "bg-zinc-800"
			}`}
			onClick={changeActiveConversation}
		>
			<div className="mx-4 flex items-center gap-3">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon-blue.png"
						altText={conversationTitle}
						type="default"
					/>
				</div>
				<div className="truncate text-sm">{conversationTitle}</div>
			</div>
		</div>
	);
}

export default ConversationCard;
