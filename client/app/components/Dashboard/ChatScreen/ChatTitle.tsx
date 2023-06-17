"use client";

import { UserContext } from "@/app/Context/UserContext";
import { useContext } from "react";

function ChatTitle() {
	const { activeConversation } = useContext(UserContext);
	const title = activeConversation?.title;

	return (
		<div className="pt-8 px-5 pb-1 text-lg bg-zinc-800 border-b-2 border-neutral-600 sticky top-0 font-medium">
			{title}
		</div>
	);
}

export default ChatTitle;
