"use client";
import { useUserStore } from "@/app/store/userStore";

import ChatInput from "./ChatInput/ChatInput";
import ChatMessages from "./ChatMessages/ChatMessages";
import ChatTitle from "./ChatTitle/ChatTitle";
import UserList from "./UserList/UserList";

function ChatScreen() {
	const showUserList = useUserStore((state) => state.showUserList);
	return (
		<div className="flex grow flex-col" style={{ wordBreak: "break-word" }}>
			<ChatTitle />
			<div className="flex h-full max-h-full flex-row overflow-auto">
				<div className="flex grow flex-col">
					<ChatMessages />
				</div>
				{showUserList && <UserList />}
			</div>
		</div>
	);
}

export default ChatScreen;
