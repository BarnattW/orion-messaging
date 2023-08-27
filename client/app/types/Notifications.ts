export interface NotificationCardProps {
	imageUrl?: string;
	altText: string;
	senderId: string;
	receiverId: string;
	type: string;
	conversationName: string;
	message: string;
	timestamp: Date;
	_id: string;
	requestId?: string;
	conversationId?: string;
}

interface NotificationCardBodyProps {
	receiverId: string;
	conversationName: string;
	message: string;
	timestamp: Date;
	_id: string;
	senderId: string;
}

export interface MessageNotificationProps extends NotificationCardBodyProps {
	conversationId: string;
}

export interface RequestNotificationsProps extends NotificationCardBodyProps {
	requestId: string;
}
