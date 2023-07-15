"use client";

import ChatMessages from "./ChatMessages/ChatMessages";
import ChatTitle from "./ChatTitle/ChatTitle";
import UserList from "./UserList/UserList";

function ChatScreen() {
	return (
		<div className="flex grow flex-col" style={{ wordBreak: "break-word" }}>
			<ChatTitle />
			<div className="flex h-full max-h-full flex-row overflow-auto">
				<div className="flex grow flex-col">
					<ChatMessages />
				</div>
				<UserList />
			</div>
		</div>
	);
}

export default ChatScreen;
