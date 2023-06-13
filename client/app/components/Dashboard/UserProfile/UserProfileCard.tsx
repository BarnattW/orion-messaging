import { UserProfileCardProps } from "@/app/types/UserProfile";
import Avatar from "../Avatar/Avatar";
import MessageIcon from "../../Icons/MessageIcon";
import Image from "next/image";
import { ForwardedRef, forwardRef } from "react";
import ExitIcon from "../../Icons/ExitIcon";

const UserProfileCard = forwardRef(function (
	{ username, imageUrl }: UserProfileCardProps,
	ref: ForwardedRef<HTMLDialogElement>
) {
	const iconClassNames: string = "fill-neutral-200 hover:fill-gray-300 h-8 w-8";
	// implement userId props and fetch data that way

	function closeProfile() {
		if (ref && "current" in ref && ref.current) {
			ref.current.close();
		}
	}
	// top-> banner + dropdown for options such as removing friend and blocking?
	// middle -> avatar + username
	// bottom -> icons for messaging
	return (
		<div className=" text-slate-50 flex flex-col gap-4 justify-center items-center">
			<div className="w-full max-h-36 overflow-hidden">
				<Image
					src="/starry.avif"
					width={300}
					height={100}
					alt="starry"
					style={{ objectFit: "scale-down" }}
					className="select-none"
				/>
				<div
					className="absolute top-0 right-0 transform -translate-x-2 translate-y-2 select-none hover:cursor-pointer"
					onClick={closeProfile}
				>
					<ExitIcon />
				</div>
			</div>
			<div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
				<Avatar
					imageUrl={imageUrl}
					altText={username}
					size={300}
					username={username}
					type="userProfile"
				/>
			</div>
			<div className="items-center flex flex-col bg-zinc-900 rounded-lg w-64 py-4 mt-8">
				<p className="text-xl">{username}</p>
				<p className="text-md">Description</p>
			</div>
			<div className="border-t-2 border-neutral-600 w-full justify-center flex p-3">
				<MessageIcon className={iconClassNames} />
			</div>
		</div>
	);
});

UserProfileCard.displayName = "UserProfileCard";

export default UserProfileCard;
