import { Message } from "../types/UserContextTypes";

const sortMessagesByTimestamps = function (userMessages: Message[]) {
	if (userMessages === undefined) {
		return [];
	}
	const sortedMessages = userMessages.map((message, i) => {
		const currentTime = message.timestamp.getTime();
		const prevMessageTime = i > 0 ? userMessages[i - 1].timestamp.getTime() : 0;
		const timeDifference = currentTime - prevMessageTime;
		const renderUserMessage =
			i === 0 ||
			message.senderId !== userMessages[i - 1].senderId ||
			timeDifference >= 300000;
		const renderDatestamp = i === 0 || timeDifference >= 86400000;
		return { ...message, renderUserMessage, renderDatestamp };
	});
	return sortedMessages;
};

export default sortMessagesByTimestamps;
