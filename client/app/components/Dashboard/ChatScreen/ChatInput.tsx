"use client";

import { useRef, useState, useEffect } from "react";
import EmojiIcon from "../../Icons/EmojiIcon";
import FileClipIcon from "../../Icons/FileClipIcon";
import SendIcon from "../../Icons/SendIcon";
import messageSocket from "@/app/sockets/messageSocket";
import { useUserStore } from "@/app/store/userStore";
import { shallow } from "zustand/shallow";

function ChatInput() {
	const { activeConversation, userId } = useUserStore(
		(state) => ({
			activeConversation: state.activeConversation,
			userId: state.userId,
		}),
		shallow
	);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

	const iconClassNames: string = "fill-gray-100 h-6 w-6 hover:cursor-pointer";
	const maxCharacters: number = 2000;

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = inputRef.current.scrollHeight + "px";
			setIsScrollbarVisible(
				inputRef.current.scrollHeight > inputRef.current.clientHeight
			);
		}
	}, [inputValue]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		if (value.length <= maxCharacters) {
			setInputValue(value);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			// Handle submission logic here
			sendMessage();
		}
	};

	async function sendMessage() {
		if (activeConversation) {
			try {
				messageSocket.emit("sendMessage", {
					conversationId: activeConversation?.conversationId,
					userId: userId,
					message: inputValue,
				});
				setInputValue("");
			} catch (error) {
				console.log(error);
			}
		}
	}

	return (
		<div className="mx-5 rounded-xl bg-zinc-700 my-3 flex items-end">
			<div className="flex px-3 gap-3 pb-2">
				<FileClipIcon className={iconClassNames} />
				<EmojiIcon className={iconClassNames} />
			</div>
			<textarea
				ref={inputRef}
				rows={1}
				className={`grow max-h-[50vh] overflow-y-auto bg-zinc-700 rounded-xl outline-none px-3 py-2 scrollbar-thin resize-none w-full ${
					isScrollbarVisible ? "scrollbar-thumb-neutral-800" : "scrollbar-none"
				}`}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				value={inputValue}
			/>

			<button className="px-3 pb-2" onClick={sendMessage}>
				<SendIcon className={iconClassNames} />
			</button>
		</div>
	);
}

export default ChatInput;
