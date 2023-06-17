import UserProfileCard from "../UserProfile/UserProfileCard";
import Avatar from "../Avatar/Avatar";
import { UserProfile } from "@/app/types/UserProfile";
import { useRef } from "react";
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
				className={`${classes.userProfileModal} w-max sm:w-72 bg-zinc-800 rounded-xl outline-none p-0`}
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
