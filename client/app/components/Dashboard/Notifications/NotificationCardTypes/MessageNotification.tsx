import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";
import { MessageNotificationProps } from "@/app/types/Notifications";
import { Conversation } from "@/app/types/UserContextTypes";

function MessageNotification({
	timestamp,
	message,
	receiverId,
	conversationName,
	conversationId,
	_id,
	senderId,
}: MessageNotificationProps) {
	const {
		users,
		activeConversation,
		setActiveConversation,
		messages,
		deleteNotifications,
		conversations,
		setMessages,
	} = useUserStore((state) => ({
		users: state.users,
		activeConversation: state.activeConversation,
		setActiveConversation: state.setActiveConversation,
		messages: state.messages,
		deleteNotifications: state.deleteNotifications,
		conversations: state.conversations,
		setMessages: state.setMessages,
	}));
	console.log(activeConversation);

	function changeActiveConversation() {
		if (activeConversation?.conversationId != conversationId) {
			//@ts-ignore
			const currentConversation: Conversation = conversations[conversationId];
			console.log("current conversation", currentConversation);
			if (
				messages[conversationId] != undefined &&
				messages[conversationId].latestMessageTimestamp != null
			) {
				// messages are already cached
				setActiveConversation({
					title: conversationName,
					conversationId: conversationId,
					latestMessageTimestamp: messages[conversationId]
						.latestMessageTimestamp as Date,
					hasMore: messages[conversationId].hasMore as boolean,
					lastScrollTop: messages[conversationId].lastScrollTop,
					canLoad: !messages[conversationId].initialLoadComplete,
					initialLoadComplete: messages[conversationId].initialLoadComplete,
					users: currentConversation.userData,
					groupId: currentConversation.groupId,
				});
			} else {
				// initialize messages and activeConversation
				setActiveConversation({
					title: conversationName,
					conversationId: conversationId,
					latestMessageTimestamp: new Date(),
					hasMore: true,
					lastScrollTop: null,
					canLoad: true,
					initialLoadComplete: false,
					users: currentConversation.userData,
					groupId: currentConversation.groupId,
				});

				const updatedFields = {
					messages: [],
					latestMessageTimestamp: currentConversation.latestMessageTimestamp,
					hasMore: true,
					lastScrollTop: null,
					initialLoadComplete: false,
				};
				setMessages(conversationId, updatedFields);
			}
		}
		notificationSocket.emit("deleteNotification", _id);
		deleteNotifications(_id);
	}
	return (
		<div
			className="text-sm flex flex-col w-2/3"
			onClick={changeActiveConversation}
		>
			<span>{`${users[senderId].username} sent you a message`}</span>
			<span className="text-xs text-neutral-200">
				{timestamp.toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</span>
			<span className="bg-gray-600 p-2 rounded-md mt-2 truncate">
				{message}
			</span>
		</div>
	);
}

export default MessageNotification;
