export interface FriendList {
	onlineFriends: string[];
	offlineFriends: string[];
}

export interface FriendCardProps {
	imageUrl?: string;
	altText: string;
	userId: string;
	username: string;
	onlineStatus: boolean;
	handleContextMenu?: (
		event: MouseEvent<HTMLDivElement>,
		friendId: string
	) => void;
}

export interface OnlineStatusProps {
	onlineStatus: boolean;
}
