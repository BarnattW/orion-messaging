import { memo, useState } from "react";
import { SentMessage } from "@/app/types/Messages";

const SentMessage = memo(function SentMessage(message: SentMessage) {
	const [showTimestamp, setShowTimestamp] = useState(false);

	const handleMouseEnter = () => {
		setShowTimestamp(true);
	};

	const handleMouseLeave = () => {
		setShowTimestamp(false);
	};

	if (message.type === "consecutiveMessage") {
		return (
			<div
				className="relative text-sm px-20 hover:bg-zinc-700 pb-1"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<p
					className="text-xs mt-1 text-neutral-400 absolute z-20 -ml-16"
					style={{ whiteSpace: "nowrap" }}
				>
					{showTimestamp &&
						message.timestamp.toLocaleString(undefined, {
							hour: "numeric",
							minute: "numeric",
						})}
				</p>
				<div className="flex gap-5">
					<p>{message.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col text-sm ">
			<div className="flex gap-5">
				<p className="font-semibold">{message.senderUsername}</p>
				<p className="text-xs mt-1 text-neutral-400 shrink-0">
					{message.timestamp.toLocaleString(undefined, {
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</p>
			</div>
			<p>{message.message}</p>
		</div>
	);
});

export default SentMessage;
