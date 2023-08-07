import { MessageNotificationProps } from "@/app/types/Notifications";

function MessageNotification({
	timestamp,
	message,
	receiverId,
	conversationName,
	conversationId,
	_id,
}: MessageNotificationProps) {
	return (
		<div className="text-sm flex flex-col w-2/3">
			<span>{`username sent you a message`}</span>
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
