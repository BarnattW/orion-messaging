export interface Request {
	senderId: string;
	receiverId: string;
	status: string;
	requestType: string;
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
