import { useRef } from "react";

import { UserProfile } from "@/app/types/UserProfile";

import DialogWrapper from "../../Dialog/DialogWrapper";
import Avatar from "../Avatar/Avatar";
import UserProfileCard from "../UserProfile/UserProfileCard";

function UserProfile({
	imageUrl,
	size = 300,
	username,
	type,
	userId,
}: UserProfile) {
	return (
		<DialogWrapper
			content={
				<UserProfileCard
					username={username}
					imageUrl="/friend-icon-blue.png"
					userId={userId}
					key={userId}
				/>
			}
			trigger={
				<Avatar
					imageUrl="/friend-icon-blue.png"
					altText={username}
					size={size}
					type={type}
				/>
			}
		/>
	);
}

export default UserProfile;
