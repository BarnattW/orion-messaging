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
}

export interface OnlineStatusProps {
	onlineStatus: boolean;
}
