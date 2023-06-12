export interface UserProfile {
	imageUrl: string;
	altText: string;
	size?: number;
	username: string;
	type: string;
}

export interface AvatarProps extends UserProfile {}

export interface UserProfileCardProps {
	username: string;
	imageUrl: string;
}
