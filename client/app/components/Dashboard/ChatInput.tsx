function ChatInput() {
	return (
		<div className="mt-auto mx-8 rounded-xl bg-zinc-700 flex mb-4">
			<textarea className="w-full resize-none rounded-xl bg-zinc-700 focus:ring-0 overflow-visible"></textarea>
			<button>Send</button>
		</div>
	);
}

export default ChatInput;
