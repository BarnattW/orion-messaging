import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";
import ChatTitle from "../ChatTitle";

function ChatScreen() {
	return (
		<div
			className="h-full flex-col grow hidden sm:flex"
			style={{ wordBreak: "break-word" }}
		>
			<ChatTitle />
			<ChatMessages />
			<ChatInput />
		</div>
	);
}

export default ChatScreen;
