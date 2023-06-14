interface Message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

const sortMessagesByTimestamps = function (userMessages: Message[]) {
	const sortedMessages = userMessages.map((message, i) => {
		const currentTime = message.timeStamp.getTime();
		const prevMessageTime = i > 0 ? userMessages[i - 1].timeStamp.getTime() : 0;
		const timeDifference = currentTime - prevMessageTime;
		const renderUserMessage =
			i === 0 ||
			message.sender !== userMessages[i - 1].sender ||
			timeDifference >= 300000;
		const renderDatestamp = i === 0 || timeDifference >= 86400000;
		return { ...message, renderUserMessage, renderDatestamp };
	});
	return sortedMessages;
};

export default sortMessagesByTimestamps;
