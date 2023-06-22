"use client";

import { useUserStore } from "@/app/store/userStore";
import { shallow } from "zustand/shallow";

function ChatTitle() {
	const { activeConversation } = useUserStore(
		(state) => ({
			activeConversation: state.activeConversation,
		}),
		shallow
	);
	const title = activeConversation?.title;

	return (
		<div className="pt-8 px-5 pb-1 text-lg bg-zinc-800 border-b-2 border-neutral-600 sticky top-0 font-medium">
			{title}
		</div>
	);
}

export default ChatTitle;
