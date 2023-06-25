import { Message } from "../types/UserContextTypes";

export const findMessageByTimestamps = (
	message: Message,
	userMessages: Message[] | undefined
) => {
	// performs binary search and returns index of particular message in userMessage array
	if (!userMessages) return;

	let left = 0;
	let right = userMessages.length - 1;
    let index = -1;
		message.timestamp = new Date(message.timestamp);
		while (left <= right) {
			let mid = Math.floor((left + right) / 2);
			if (userMessages[mid]._id === message._id) {
				index = mid;
				return index;
			} else if (userMessages[mid].timestamp > message.timestamp) {
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}
	return index;
};
