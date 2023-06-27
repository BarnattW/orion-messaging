"use client";

import { useState } from "react";

import { useUserStore } from "@/app/store/userStore";

const maxCharacters = 75;
function ChatTitle() {
	const activeConversation = useUserStore((state) => state.activeConversation);
	const title = activeConversation?.title;
	const [isEditing, setIsEditing] = useState(false);
	const [titleValue, setTitleValue] = useState(title);

	// editing functions
	const toggleEditingMode = () => {
		setIsEditing((prevBool) => {
			return !prevBool;
		});
	};

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value.length <= maxCharacters) {
			setTitleValue(value);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			editTitle();
			toggleEditingMode();
		}
		if (event.key === "Escape") {
			toggleEditingMode();
			setTitleValue(title);
		}
	};

	const editTitle = async () => {
		try {
			console.log("edit title");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="sticky top-0 truncate border-b-2 border-neutral-600 bg-zinc-800 px-5 pb-4 pt-8 text-lg font-medium">
			{isEditing ? (
				<input
					value={titleValue}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					className={`w-full grow resize-none rounded-sm bg-zinc-600 px-2 outline-none 
						`}
				></input>
			) : (
				<span onClick={toggleEditingMode}>{title}</span>
			)}
		</div>
	);
}

export default ChatTitle;
