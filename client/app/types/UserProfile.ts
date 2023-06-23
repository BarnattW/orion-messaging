interface UserDetails {
	username: string;
	userId: string;
}

export interface UserProfile extends UserDetails {
	imageUrl: string;
	size?: number;
	type: string;
}

export interface AvatarProps {
	altText: string;
	imageUrl: string;
	size?: number;
	type: string;
	username?: string;
}

export interface UserProfileCardProps extends UserDetails {
	imageUrl: string;
}

export interface OptionsPopoutProps extends UserDetails {
	children: React.ReactNode;
	showOptions: boolean;
	currentUserId: string | null;
	currentUsername: string | null;
}
