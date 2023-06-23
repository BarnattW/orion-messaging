"use client";

import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";

function ChatTitle() {
	const activeConversation = useUserStore((state) => state.activeConversation);
	const title = activeConversation?.title;

	return (
		<div className="sticky top-0 border-b-2 border-neutral-600 bg-zinc-800 px-5 pb-1 pt-8 text-lg font-medium">
			{title}
		</div>
	);
}

export default ChatTitle;
