import { Message } from "../types/UserContextTypes";

const sortMessagesByTimestamps = function (
	userMessages: Message[],
	startIndex: number,
	endIndex: number
) {
	if (userMessages === undefined) {
		return [];
	}

	const slicedArray = userMessages.slice(startIndex, endIndex);
	const sortedMessages = slicedArray.map((message, i) => {
		message.timestamp = new Date(message.timestamp);
		const currentDate = message.timestamp.getDate();
		const prevMessageDate = i > 0 ? userMessages[i - 1].timestamp.getDate() : 0;
		const renderUserMessage =
			i === 0 ||
			message.senderId !== userMessages[i - 1].senderId ||
			message.timestamp.getTime() - userMessages[i - 1].timestamp.getTime() >=
				300000; // set to 5 minutes
		const renderDatestamp = i === 0 || currentDate !== prevMessageDate;
		return { ...message, renderUserMessage, renderDatestamp };
	});
	userMessages.splice(startIndex, slicedArray.length, ...slicedArray);
	return sortedMessages;
};

export default sortMessagesByTimestamps;
