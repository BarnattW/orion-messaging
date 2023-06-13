import { memo } from "react";
import SentMessage from "./SentMessage";
import UserProfile from "../../UserProfile/UserProfile";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

const UserMessages = memo(function UserMessages(message: Message) {
	return (
		<div className="flex pt-3 pb-1 px-5 gap-5 text-neutral-100 hover:bg-zinc-700">
			<div className="mt-1">
				<UserProfile
					imageUrl="/friend-icon.png"
					username={message.sender}
					type="message"
				/>
			</div>
			<SentMessage {...message} />
		</div>
	);
});

export default UserMessages;
