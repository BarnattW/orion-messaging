import EmojiIcon from "../../Icons/EmojiIcon";
import FileClipIcon from "../../Icons/FileClipIcon";
import SendIcon from "../SendIcon";

function ChatInput() {
	const iconClassNames: string = "fill-gray-100 h-6 w-6 hover:cursor-pointer";

	return (
		<div className="mx-5 rounded-xl bg-zinc-700 my-3 flex items-end ">
			<div className="flex px-3 gap-3 pb-2">
				<FileClipIcon className={iconClassNames} />
				<EmojiIcon className={iconClassNames} />
			</div>
			<div
				className="grow max-h-[50vh] overflow-y-auto bg-zinc-700 rounded-xl outline-none px-3 py-2 scrollbar-thin scrollbar-thumb-neutral-800"
				contentEditable="true"
				style={{ wordBreak: "break-word" }}
			></div>
			<button className="px-3 pb-2">
				<SendIcon className={iconClassNames} />
			</button>
		</div>
	);
}

export default ChatInput;
