import { memo } from "react";
import SentMessage from "./SentMessage";
import UserProfile from "../../UserProfile/UserProfile";
import { Message } from "@/app/types/UserContextTypes";

const UserMessages = memo(function UserMessages(message: Message) {
	return (
		<div className="flex pt-3 pb-1 px-5 gap-5 text-neutral-100 hover:bg-zinc-700">
			<div className="mt-1">
				<UserProfile
					imageUrl="/friend-icon.png"
					username={message.senderUsername}
					userId={message.senderId}
					type="message"
				/>
			</div>
			<SentMessage {...message} />
		</div>
	);
});

export default UserMessages;
