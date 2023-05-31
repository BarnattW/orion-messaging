import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

function ChatScreen() {
	return (
		<div
			className="h-full flex-col grow hidden sm:flex"
			style={{ wordBreak: "break-word" }}
		>
			<div className="pt-8 px-5 pb-1 text-lg bg-zinc-800 border-b-2 border-neutral-600 sticky top-0 backdrop-blur-lg font-medium">
				Hi
			</div>
			<ChatMessages />
			<ChatInput />
		</div>
	);
}

export default ChatScreen;
