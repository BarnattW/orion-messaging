interface message {
	sender: string;
	receiver: string;
	message: string;
	messageId: string;
	timeStamp: Date;
}

function UserMessages(message: message) {
	return <div>{message.message}</div>;
}

export default UserMessages;
