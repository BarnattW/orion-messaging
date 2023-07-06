import { MouseEvent } from "react";

export interface FriendList {
	onlineFriends: string[];
	offlineFriends: string[];
}

interface FriendProps {
	imageUrl?: string;
	altText: string;
	userId: string;
	username: string;
	onlineStatus: boolean;
}

export interface SelectedFriend {
	friendId: string;
	friendUsername: string;
}

export interface FriendListItemProps extends FriendProps {
	handleContextMenu: (
		event: MouseEvent<HTMLLIElement>,
		friendInfo: SelectedFriend
	) => void;
}

export interface InviteFriendListItemProps extends FriendProps {}

export interface OnlineStatusProps {
	onlineStatus: boolean;
}

export interface FriendContextMenuProps {
	contextMenuPosition: { x: number; y: number };
	closeContextMenu: () => void;
	friendId: string;
	friendUsername: string;
}
