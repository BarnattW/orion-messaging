import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { ConversationListItemProps } from "@/app/types/Conversations";

import Avatar from "../../Avatar/Avatar";

function ConversationListItem({
	conversationId,
	type,
	conversationName,
	latestMessageTimestamp,
	groupId,
	userData,
	handleContextMenu,
}: ConversationListItemProps) {
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
		type === "friends"
			? userData.find((user) => user.userId != userId)?.username
			: conversationName;

	const onContextMenuHandler = (event: React.MouseEvent<HTMLLIElement>) => {
		event.preventDefault();
		const conversationTitle =
			type === "friends"
				? userData.find((user) => user.userId != userId)?.username
				: conversationName;
		if (groupId) {
			handleContextMenu(event, {
				type,
				conversationId,
				conversationName: conversationTitle,
				userData,
				groupId,
			});
		}
	};

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
					users: userData,
					groupId: groupId,
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
					users: userData,
					groupId: groupId,
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
		<li
			className={`py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white ${
				activeConversation?.conversationId === conversationId
					? "bg-zinc-600"
					: "bg-zinc-800"
			}`}
			onClick={changeActiveConversation}
			onContextMenu={onContextMenuHandler}
		>
			<div className="mx-4 flex items-center gap-3">
				<span className="relative z-0">
					<Avatar
						imageUrl="/friend-icon-blue.png"
						//@ts-ignore
						altText={conversationTitle}
						type="default"
					/>
				</span>
				<span className="truncate text-sm">{conversationTitle}</span>
			</div>
		</li>
	);
}

export default ConversationListItem;
