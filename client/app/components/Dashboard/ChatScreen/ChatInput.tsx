"use client";

import { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import EmojiIcon from "../../Icons/EmojiIcon";
import FileClipIcon from "../../Icons/FileClipIcon";
import SendIcon from "../SendIcon";

function ChatInput() {
	const inputRef = useRef<HTMLDivElement>(null);

	const iconClassNames: string = "fill-gray-100 h-6 w-6 hover:cursor-pointer";

	const maxCharacters: number = 2000;

	const handleInput = () => {
		//const inputValue = inputRef.current?.textContent || "";
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const inputValue = inputRef.current?.textContent || "";
		if (event.key === "Enter") {
			event.preventDefault();
			// Handle submission logic here
		}
	};

	return (
		<div className="mx-5 rounded-xl bg-zinc-700 my-3 flex items-end">
			<div className="flex px-3 gap-3 pb-2">
				<FileClipIcon className={iconClassNames} />
				<EmojiIcon className={iconClassNames} />
			</div>
			<div
				ref={inputRef}
				className="grow max-h-[50vh] overflow-y-auto bg-zinc-700 rounded-xl outline-none px-3 py-2 scrollbar-thin scrollbar-thumb-neutral-800"
				contentEditable
				style={{ wordBreak: "break-word" }}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
			></div>

			<button className="px-3 pb-2">
				<SendIcon className={iconClassNames} />
			</button>
		</div>
	);
}

export default ChatInput;
