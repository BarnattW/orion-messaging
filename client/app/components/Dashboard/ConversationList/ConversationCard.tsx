import Avatar from "../Avatar/Avatar";
import { ConversationCardProps } from "@/app/types/Conversations";
import { useUserStore } from "@/app/store/userStore";
import { shallow } from "zustand/shallow";

function ConversationCard(conversationCardProps: ConversationCardProps) {
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
		conversationCardProps.type === "individual"
			? conversationCardProps.users.find((id) => id != userId)
			: conversationCardProps.conversationName;
	function changeActiveConversation() {
		if (
			activeConversation?.conversationId != conversationCardProps.conversationId
		) {
			if (
				messages[conversationCardProps.conversationId] != undefined &&
				messages[conversationCardProps.conversationId].latestMessageTimestamp !=
					null
			) {
				// messages are already cached
				setActiveConversation({
					title: conversationTitle,
					conversationId: conversationCardProps.conversationId,
					latestMessageTimestamp: messages[conversationCardProps.conversationId]
						.latestMessageTimestamp as Date,
					hasMore: messages[conversationCardProps.conversationId]
						.hasMore as boolean,
					lastScrollTop:
						messages[conversationCardProps.conversationId].lastScrollTop,
					canLoad:
						!messages[conversationCardProps.conversationId].initialLoadComplete,
					initialLoadComplete:
						messages[conversationCardProps.conversationId].initialLoadComplete,
				});
			} else {
				// initialize messages and activeConversation
				setActiveConversation({
					title: conversationTitle,
					conversationId: conversationCardProps.conversationId,
					latestMessageTimestamp: conversationCardProps.latestMessageTimestamp,
					hasMore: true,
					lastScrollTop: null,
					canLoad: true,
					initialLoadComplete: false,
				});

				const updatedFields = {
					messages: [],
					latestMessageTimestamp: conversationCardProps.latestMessageTimestamp,
					hasMore: true,
					lastScrollTop: null,
					initialLoadComplete: false,
				};
				setMessages(conversationCardProps.conversationId, updatedFields);
			}
		}
	}

	return (
		<div
			className={`py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white ${
				activeConversation?.conversationId ===
				conversationCardProps.conversationId
					? "bg-zinc-600"
					: "bg-zinc-800"
			}`}
			onClick={changeActiveConversation}
		>
			<div className="flex mx-4 gap-3 items-center">
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
