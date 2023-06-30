"use client";
import { useUserStore } from "@/app/store/userStore";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages/ChatMessages";
import ChatTitle from "./ChatTitle";
import UserList from "./UserList/UserList";

function ChatScreen() {
	const showUserList = useUserStore((state) => state.showUserList);
	return (
		<div
			className="flex h-full grow flex-col overflow-auto"
			style={{ wordBreak: "break-word" }}
		>
			<ChatTitle />
			<div className="flex h-full flex-row">
				<div className="flex h-full grow flex-col overflow-auto">
					<ChatMessages />
					<ChatInput />
				</div>
				{showUserList && <UserList />}
			</div>
		</div>
	);
}

export default ChatScreen;
