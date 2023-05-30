import ChatInput from "./ChatInput";

function ChatScreen() {
	return (
		<div className="flex flex-col grow">
			<div className="pt-8 px-8 pb-1 text-lg bg-zinc-800 border-b-2 border-neutral-600 sticky top-0 backdrop-blur-lg font-medium">
				Hi
			</div>
			<ChatInput />
		</div>
	);
}

export default ChatScreen;
