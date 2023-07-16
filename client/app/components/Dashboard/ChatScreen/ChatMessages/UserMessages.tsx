import { memo } from "react";

import { useUserStore } from "@/app/store/userStore";
import { Message } from "@/app/types/UserContextTypes";

import UserProfile from "../../UserProfile/UserProfile";
import SentMessage from "./SentMessage";

const UserMessages = memo(function UserMessages(message: Message) {
	const { users } = useUserStore((state) => ({ users: state.users }));

	return (
		<div className="flex gap-5 px-5 pb-1 text-neutral-100 hover:bg-zinc-700">
			<div className="mt-1">
				<UserProfile
					imageUrl="/friend-icon.png"
					username={users[message.senderId].username}
					userId={message.senderId}
					type="message"
				/>
			</div>
			<SentMessage {...message} />
		</div>
	);
});

export default UserMessages;
