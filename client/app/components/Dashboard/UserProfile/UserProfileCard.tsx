import Link from "next/link";
import { ForwardedRef, forwardRef, useState } from "react";

import { useUserStore } from "@/app/store/userStore";
import { UserProfileCardProps } from "@/app/types/UserProfile";

import ExitIcon from "../../Icons/ExitIcon";
import GearIcon from "../../Icons/GearIcon";
import KebabMenuIcon from "../../Icons/KebabMenuIcon";
import MessageIcon from "../../Icons/MessageIcon";
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
		// to-do -> update activeConversation
		console.log("navigating to message");
		if (ref && "current" in ref && ref.current) {
			ref.current.close();
		}
	}

	function toggleOptions() {
		setToggleOptionsPopout((prevBool) => !prevBool);
	}

	return (
		<div className="flex h-96 flex-col items-center justify-center gap-4 rounded-md bg-zinc-800 text-slate-50">
			<div className="flex h-48 w-full items-end justify-center rounded-md bg-[url('/starry.avif')]">
				<div className="translate-y-1/2 transform select-none">
					<Avatar
						imageUrl={imageUrl}
						altText={username}
						size={300}
						type="userProfile"
					/>
				</div>
				<div
					className="absolute right-0 top-0 -translate-x-2 translate-y-2 transform select-none hover:cursor-pointer"
					onClick={closeProfile}
				>
					<ExitIcon />
				</div>
			</div>
			<div className="mt-8 flex h-32 w-64 flex-col items-center justify-center rounded-lg bg-zinc-900 py-2">
				<p className="text-xl">{username}</p>
				<p className="line-clamp-3 w-64 px-7 text-center text-sm">
					Description
				</p>
			</div>
			<div className="flex w-full flex-row justify-around border-t-2 border-neutral-600 p-3">
				{userId != currentUserId && (
					<>
						<span onClick={showMessage}>
							<MessageIcon className={iconClassNames} />
						</span>
						<OptionsPopout
							showOptions={toggleOptionsPopout}
							currentUserId={currentUserId}
							currentUsername={currentUsername}
							username={username}
							userId={userId}
						>
							<span onClick={toggleOptions}>
								<KebabMenuIcon className={iconClassNames} />
							</span>
						</OptionsPopout>
					</>
				)}
				{userId === currentUserId && (
					<Link href="/dashboard/settings" onClick={closeProfile}>
						<GearIcon className={iconClassNames} />
					</Link>
				)}
			</div>
		</div>
	);
});

UserProfileCard.displayName = "UserProfileCard";

export default UserProfileCard;
