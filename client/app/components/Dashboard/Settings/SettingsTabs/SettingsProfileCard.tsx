import ExitIcon from "@/app/components/Icons/ExitIcon";
import GearIcon from "@/app/components/Icons/GearIcon";
import { UserProfileCardProps } from "@/app/types/UserProfile";

import Avatar from "../../Avatar/Avatar";

const iconClassNames: string =
	"fill-neutral-200 hover:fill-gray-400 h-8 w-8 hover:cursor-pointer";

function SettingsProfileCard({
	username,
	userId,
	imageUrl,
	status,
}: UserProfileCardProps) {
	return (
		<div className="flex h-96 flex-col items-center justify-center gap-4 rounded-md bg-zinc-800 text-slate-50">
			<div className="flex h-48 w-full items-end justify-center rounded-md bg-[url('/starry.avif')]">
				<span className="translate-y-1/2 transform select-none">
					<Avatar
						imageUrl={imageUrl}
						altText={username}
						size={300}
						type="userProfile"
					/>
				</span>
				<span className="absolute right-0 top-0 -translate-x-2 translate-y-2 transform select-none hover:cursor-pointer">
					<ExitIcon />
				</span>
			</div>
			<div className="mt-8 flex h-32 w-64 flex-col items-center justify-center rounded-lg bg-zinc-900 py-2">
				<p className="text-xl">{username}</p>
				<p className="line-clamp-3 w-64 px-7 text-center text-sm">
					{status ? status : "Description"}
				</p>
			</div>
			<div className="flex w-full flex-row justify-around border-t-2 border-neutral-600 p-3">
				<GearIcon className={iconClassNames} />
			</div>
		</div>
	);
}

SettingsProfileCard.displayName = "SettingsProfileCard";

export default SettingsProfileCard;
