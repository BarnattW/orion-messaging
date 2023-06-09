import { memo } from "react";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
	type?: string;
}

const SentMessage = memo(function SentMessage(message: Message) {
	if (message.type === "consecutiveMessage") {
		return (
			<div className="flex flex-col text-sm px-16 hover:bg-zinc-700 pb-1">
				<div className="flex gap-5">
					<p>{message.message}</p>
					<p className="text-xs mt-1 text-neutral-400 ">
						{message.timeStamp.toLocaleString()}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col text-sm ">
			<div className="flex gap-5">
				<p className="font-semibold">{message.sender}</p>
				<p className="text-xs mt-1 text-neutral-400 ">
					{message.timeStamp.toLocaleString()}
				</p>
			</div>
			<p>{message.message}</p>
		</div>
	);
});

export default SentMessage;
