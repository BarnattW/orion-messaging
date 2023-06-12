import UserProfileCard from "../UserProfile/UserProfileCard";
import Avatar from "../Avatar/Avatar";
import { UserProfile } from "@/app/types/UserProfile";
import { useRef } from "react";
import classes from "./UserProfile.module.css";

function UserProfile({
	imageUrl,
	altText,
	size = 300,
	username,
	type,
}: UserProfile) {
	const userProfileCardRef = useRef<HTMLDialogElement>(null);

	function showProfile() {
		if (userProfileCardRef.current) {
			userProfileCardRef.current.showModal();
		}
	}

	return (
		<>
			<dialog
				ref={userProfileCardRef}
				className={`${classes.userProfileModal} w-max sm:w-72 bg-zinc-800 rounded-xl outline-none p-0`}
			>
				<UserProfileCard username={username} imageUrl="/friend-icon-blue.png" />
			</dialog>
			<div onClick={showProfile} className="select-none">
				<Avatar
					imageUrl="/friend-icon-blue.png"
					altText={altText}
					size={size}
					username={username}
					type={type}
				/>
			</div>
		</>
	);
}

export default UserProfile;
