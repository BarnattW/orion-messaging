function ChatInput() {
	return (
		<div className="mt-auto mx-8 rounded-xl bg-zinc-700 flex mb-4">
			<textarea className="w-full resize-none rounded-xl bg-zinc-700 focus:ring-0 focus:outline-none pt-1 px-2 overflow-auto max-h-96"></textarea>
			<button>Send</button>
		</div>
	);
}

export default ChatInput;
