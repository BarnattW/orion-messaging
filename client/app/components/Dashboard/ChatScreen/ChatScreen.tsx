import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages/ChatMessages";
import ChatTitle from "./ChatTitle";

function ChatScreen() {
	return (
		<div
			className="h-full flex-col grow flex"
			style={{ wordBreak: "break-word" }}
		>
			<ChatTitle />
			<ChatMessages />
			<ChatInput />
		</div>
	);
}

export default ChatScreen;
