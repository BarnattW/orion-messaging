import { memo } from "react";

import Avatar from "../../Avatar/Avatar";
import SentMessage from "./SentMessage";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

const UserMessages = memo(function UserMessages(message: Message) {
	return (
		<div className="flex pt-3 pb-1 px-5 gap-3 text-neutral-100 hover:bg-zinc-700">
			<div className="mt-1">
				<Avatar imageUrl="/friend-icon.svg" altText={message.sender} />
			</div>
			<SentMessage {...message} />
		</div>
	);
});

export default UserMessages;
