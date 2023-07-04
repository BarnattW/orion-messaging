"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import messageSocket from "@/app/sockets/messageSocket";
import { useUserStore } from "@/app/store/userStore";

import EmojiIcon from "../../../Icons/EmojiIcon";
import FileClipIcon from "../../../Icons/FileClipIcon";
import SendIcon from "../../../Icons/SendIcon";

const iconClassNames: string =
	"fill-gray-100 h-6 w-6 hover:cursor-pointer stroke-gray-100 hover:stroke-gray-400";
const maxCharacters: number = 2000;

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
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	console.log(isComponentVisible);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = inputRef.current.scrollHeight + "px";
			if (inputRef.current.scrollHeight > inputRef.current.clientHeight)
				setIsScrollbarVisible(true);
		}
	}, [inputValue]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		if (value.length <= maxCharacters) {
			setInputValue(value);
		}
	};

	const handleEmojiInput = (emoji: {
		id: string;
		name: string;
		native: string;
		shortcodes: string;
	}) => {
		console.log(emoji);
		if (inputValue.length <= maxCharacters) {
			setInputValue((prevVal) => prevVal + emoji.native);
			setIsComponentVisible(false);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			sendMessage();
		}
	};

	function toggleEmojiPicker() {
		setIsComponentVisible((prevBool: boolean) => !prevBool);
	}

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
		<div className="mx-5 my-3 flex items-end rounded-xl bg-zinc-700">
			<div className="flex gap-3 px-3 pb-2">
				<FileClipIcon className={iconClassNames} />
				<div className="relative" ref={ref}>
					<div onClick={toggleEmojiPicker}>
						<EmojiIcon className={iconClassNames} />
					</div>
					{isComponentVisible && (
						<div className="absolute bottom-full z-20 overflow-auto text-sm scrollbar-thin scrollbar-thumb-neutral-800">
							<Picker data={data} onEmojiSelect={handleEmojiInput} />
						</div>
					)}
				</div>
			</div>
			<textarea
				ref={inputRef}
				rows={1}
				className={`max-h-[50vh] w-full grow resize-none overflow-y-auto rounded-xl bg-zinc-700 px-3 py-2 outline-none scrollbar-thin ${
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
