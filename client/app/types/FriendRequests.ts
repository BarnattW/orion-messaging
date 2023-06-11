export interface Request {
	_id: string;
	senderId: string;
	receiverId: string;
	status: string;
	requestType: string;
	senderUsername: string;
	receiverUsername: string;
}

export interface FriendRequests {
	receivedRequests: Request[];
	sentRequests: Request[];
}

export interface receviedRequestsProps {
	receivedRequests: Request[];
}

export interface SentFriendRequestsProps {
	sentRequests: Request[];
}

export interface RequestCardProps {
	imageUrl?: string;
	altText?: string;
	userId: string;
	username: string;
	requestId: string;
}
