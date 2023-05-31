import Avatar from "../Avatar/Avatar";

interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

function UserMessages(message: Message) {
	return (
		<div className="flex my-3 mx-5 gap-3 text-neutral-100">
			<div className="mt-1">
				<Avatar imageUrl="/barn.png" altText={message.sender} />
			</div>
			<div className="flex flex-col text-sm">
				<div className="flex gap-5">
					<p className="font-semibold">{message.sender}</p>
					<p className="text-xs mt-1 text-neutral-400 ">
						{message.timeStamp.toUTCString()}
					</p>
				</div>
				<p>{message.message}</p>
			</div>
		</div>
	);
}

export default UserMessages;
