interface ChatDateProps {
	timeStamp: Date;
}

function ChatDate({ timeStamp }: ChatDateProps) {
	return (
		<div className="flex justify-center items-center text-sm pt-4 pb-2 mx-4">
			<div className="border-t border-zinc-500 flex-grow"></div>
			<div className="mx-2">
				{timeStamp.toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>
			<div className="border-t border-zinc-500 flex-grow"></div>
		</div>
	);
}

export default ChatDate;
