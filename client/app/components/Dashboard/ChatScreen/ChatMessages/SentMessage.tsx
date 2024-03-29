import { memo, useState } from "react";

import DeleteIcon from "@/app/components/Icons/DeleteIcon";
import EditIcon from "@/app/components/Icons/EditIcon";
import messageSocket from "@/app/sockets/messageSocket";
import { useUserStore } from "@/app/store/userStore";
import { SentMessage } from "@/app/types/Messages";

const iconClassNames: string =
	"fill-gray-100 hover:fill-gray-400 h-5 w-5 m-1 stroke-gray-100 hover:stroke-gray-400";
const maxCharacters: number = 2000;

const SentMessage = memo(function SentMessage(message: SentMessage) {
	const { activeConversation, userId, users } = useUserStore((state) => ({
		activeConversation: state.activeConversation,
		userId: state.userId,
		users: state.users,
	}));
	const [showDetails, setDetails] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [messageValue, setMessageValue] = useState(message.message);

	const handleMouseMove = () => {
		setDetails(true);
	};

	const handleMouseOut = () => {
		setDetails(false);
	};

	const deleteMessage = async () => {
		try {
			messageSocket.emit("deleteMessage", {
				messageId: message._id,
				conversationId: activeConversation?.conversationId,
			});
		} catch (error) {
			console.log(error);
		}
	};

	// editing functions
	const editMessage = async () => {
		try {
			messageSocket.emit("editMessage", {
				messageId: message._id,
				text: messageValue,
				conversationId: activeConversation?.conversationId,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const toggleEditingMode = () => {
		setIsEditing((prevBool) => {
			return !prevBool;
		});
	};

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		if (value.length <= maxCharacters) {
			setMessageValue(value);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			editMessage();
			toggleEditingMode();
		}
		if (event.key === "Escape") {
			toggleEditingMode();
			setMessageValue(message.message);
		}
	};

	if (message.type === "consecutiveMessage") {
		return (
			<div
				className="relative px-20 py-1 text-sm hover:bg-zinc-700"
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
			>
				<p
					className="absolute z-20 -ml-16 text-xs text-neutral-400"
					style={{ whiteSpace: "nowrap" }}
				>
					{showDetails &&
						message.timestamp.toLocaleString(undefined, {
							hour: "numeric",
							minute: "numeric",
						})}
				</p>
				{isEditing ? (
					<textarea
						rows={2}
						className={`w-full grow resize-none overflow-y-auto rounded-md bg-zinc-600 px-3 py-2 outline-none scrollbar-thin scrollbar-thumb-neutral-800
						`}
						value={messageValue}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
					/>
				) : (
					<p>{message.message}</p>
				)}

				{showDetails && message.senderId === userId && (
					<div className="absolute -top-5 right-8 rounded border-2 border-zinc-800 bg-zinc-700">
						<div className="flex">
							<div onClick={toggleEditingMode} className="hover:cursor-pointer">
								<EditIcon className={iconClassNames} />
							</div>
							<div onClick={deleteMessage} className="hover:cursor-pointer">
								<DeleteIcon className={iconClassNames} />
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex grow flex-col text-sm ">
			<div
				className="relative"
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
			>
				<div className="flex gap-5">
					<p className="font-semibold">{users[message.senderId].username}</p>
					<p className="mt-1 shrink-0 text-xs text-neutral-400">
						{message.timestamp.toLocaleString(undefined, {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</p>
				</div>
				{isEditing ? (
					<textarea
						rows={2}
						className={`w-full grow resize-none overflow-y-auto rounded-md bg-zinc-600 px-3 py-2 outline-none scrollbar-thin scrollbar-thumb-neutral-800
						`}
						value={messageValue}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
					/>
				) : (
					<p>{message.message}</p>
				)}
				{showDetails && message.senderId === userId && (
					<div className="absolute -top-5 right-3 rounded border-2 border-zinc-800 bg-zinc-700">
						<div className="flex">
							<span
								onClick={toggleEditingMode}
								className="hover:cursor-pointer"
							>
								<EditIcon className={iconClassNames} />
							</span>
							<span onClick={deleteMessage} className="hover:cursor-pointer">
								<DeleteIcon className={iconClassNames} />
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
});

export default SentMessage;
