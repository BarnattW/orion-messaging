import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages/ChatMessages";
import ChatTitle from "./ChatTitle";

function ChatScreen() {
	return (
		<div
			className="flex h-full grow flex-col overflow-auto"
			style={{ wordBreak: "break-word" }}
		>
			<ChatTitle />
			<ChatMessages />
			<ChatInput />
		</div>
	);
}

export default ChatScreen;
