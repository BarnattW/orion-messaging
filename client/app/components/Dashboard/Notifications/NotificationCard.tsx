import { useState } from "react";

import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";
import { NotificationCardProps } from "@/app/types/Notifications";

import ExitIcon from "../../Icons/ExitIcon";
import UserProfile from "../UserProfile/UserProfile";
import FriendRequestNotification from "./NotificationCardTypes/FriendRequestNotification";
import GroupRequestNotification from "./NotificationCardTypes/GroupRequestNotification";
import MessageNotification from "./NotificationCardTypes/MessageNotification";

function NotificationCard({
	type,
	receiverId,
	altText,
	imageUrl,
	conversationName,
	message,
	timestamp,
	_id,
	requestId,
	conversationId,
	senderId,
}: NotificationCardProps) {
	const { deleteNotifications } = useUserStore((state) => ({
		deleteNotifications: state.deleteNotifications,
	}));
	const [showExit, setShowExit] = useState(false);
	function deleteNotification() {
		console.log("deleting notif");
		notificationSocket.emit("deleteNotification", _id);
		deleteNotifications(_id);
	}

	return (
		<div
			className="py-2 pl-1 hover:bg-neutral-800 hover:text-neutral-50 hover:cursor-pointer focus:bg-white max-w-full"
			onMouseOver={() => {
				setShowExit(true);
			}}
			onMouseLeave={() => {
				setShowExit(false);
			}}
		>
			<div className="flex mx-4 gap-3 max-w-full w-full">
				<div className="relative z-0">
					<UserProfile
						imageUrl="/friend-icon-blue.png"
						userId="a"
						username="a"
						type="message"
					/>
				</div>
				{type == "message" ? (
					<MessageNotification
						receiverId={receiverId}
						message={message}
						timestamp={timestamp}
						conversationName={conversationName}
						conversationId={conversationId}
						_id={_id}
					/>
				) : null}
				{type == "friends" ? (
					<FriendRequestNotification
						receiverId={receiverId}
						message={message}
						timestamp={timestamp}
						conversationName={conversationName}
						requestId={requestId}
						_id={_id}
						senderId={senderId}
					/>
				) : null}
				{type == "groups" ? (
					<GroupRequestNotification
						receiverId={receiverId}
						message={message}
						timestamp={timestamp}
						conversationName={conversationName}
						requestId={requestId}
						_id={_id}
						senderId={senderId}
					/>
				) : null}
				{showExit && (
					<div onClick={deleteNotification}>
						<ExitIcon />
					</div>
				)}
			</div>
		</div>
	);
}

export default NotificationCard;
