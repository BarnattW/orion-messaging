import Image from "next/image";
import { ForwardedRef, forwardRef, useState } from "react";

import { useUserStore } from "@/app/store/userStore";
import { UserProfileCardProps } from "@/app/types/UserProfile";

import ExitIcon from "../../Icons/ExitIcon";
import MessageIcon from "../../Icons/MessageIcon";
import OptionsIcon from "../../Icons/OptionsIcon";
import Avatar from "../Avatar/Avatar";
import OptionsPopout from "./OptionsPopout";

const iconClassNames: string =
	"fill-neutral-200 hover:fill-gray-400 h-8 w-8 hover:cursor-pointer";

const UserProfileCard = forwardRef(function (
	{ username, userId, imageUrl }: UserProfileCardProps,
	ref: ForwardedRef<HTMLDialogElement>
) {
	const [toggleOptionsPopout, setToggleOptionsPopout] = useState(false);
	const currentUsername = useUserStore((state) => state.username);
	const currentUserId = useUserStore((state) => state.userId);

	function closeProfile() {
		if (ref && "current" in ref && ref.current) {
			ref.current.close();
		}
	}

	function showMessage() {
		// to-do
		console.log("navigating to message");
	}

	function toggleOptions() {
		setToggleOptionsPopout((prevBool) => !prevBool);
	}

	return (
		<>
			<OptionsPopout
				showOptions={toggleOptionsPopout}
				currentUserId={currentUserId}
				currentUsername={currentUsername}
				username={username}
				userId={userId}
			>
				<div className=" flex flex-col items-center justify-center gap-4 text-slate-50">
					<div className="max-h-36 w-full overflow-hidden">
						<Image
							src="/starry.avif"
							width={300}
							height={100}
							alt="starry"
							style={{ objectFit: "scale-down" }}
							className="select-none"
						/>
						<div
							className="absolute right-0 top-0 -translate-x-2 translate-y-2 transform select-none hover:cursor-pointer"
							onClick={closeProfile}
						>
							<ExitIcon />
						</div>
					</div>
					<div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transform select-none">
						<Avatar
							imageUrl={imageUrl}
							altText={username}
							size={300}
							type="userProfile"
						/>
					</div>
					<div className="mt-8 flex w-64 flex-col items-center rounded-lg bg-zinc-900 py-4">
						<p className="text-xl">{username}</p>
						<p className="text-md">Description</p>
					</div>
					<div className="flex w-full flex-row justify-around border-t-2 border-neutral-600 p-3">
						{username != currentUsername && (
							<div onClick={showMessage}>
								<MessageIcon className={iconClassNames} />
							</div>
						)}

						{username != currentUsername && (
							<div onClick={toggleOptions}>
								<OptionsIcon className={iconClassNames} />
							</div>
						)}
					</div>
				</div>
			</OptionsPopout>
		</>
	);
});

UserProfileCard.displayName = "UserProfileCard";

export default UserProfileCard;
