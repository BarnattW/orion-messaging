import { useRef } from "react";

import { UserProfile } from "@/app/types/UserProfile";

import Avatar from "../Avatar/Avatar";
import UserProfileCard from "../UserProfile/UserProfileCard";
import classes from "./UserProfile.module.css";

function UserProfile({
	imageUrl,
	size = 300,
	username,
	type,
	userId,
}: UserProfile) {
	const userProfileCardRef = useRef<HTMLDialogElement>(null);

	function showProfile() {
		if (userProfileCardRef.current) {
			userProfileCardRef.current.showModal();
		}
	}

	function closeProfile(event: React.MouseEvent<HTMLDialogElement>) {
		if (
			event.target === userProfileCardRef.current &&
			userProfileCardRef.current
		) {
			userProfileCardRef.current.close();
		}
	}

	return (
		<>
			<dialog
				ref={userProfileCardRef}
				className={`${classes.userProfileModal} w-max rounded-xl bg-zinc-800 p-0 outline-none sm:w-72`}
				onClick={closeProfile}
			>
				<UserProfileCard
					username={username}
					imageUrl="/friend-icon-blue.png"
					ref={userProfileCardRef}
					userId={userId}
					key={userId}
				/>
			</dialog>
			<div onClick={showProfile} className="select-none">
				<Avatar
					imageUrl="/friend-icon-blue.png"
					altText={username}
					size={size}
					type={type}
				/>
			</div>
		</>
	);
}

export default UserProfile;
