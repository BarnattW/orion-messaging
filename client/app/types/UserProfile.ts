export interface UserProfile {
	imageUrl: string;
	size?: number;
	username: string;
	type: string;
}

export interface AvatarProps extends UserProfile {
	altText: string;
}

export interface UserProfileCardProps {
	username: string;
	imageUrl: string;
}
