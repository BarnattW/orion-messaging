import { FriendCardProps } from "@/app/types/FriendList";

import OnlineStatus from "../Avatar/OnlineStatus";
import UserProfile from "../UserProfile/UserProfile";

function FriendCard({
	imageUrl,
	altText,
	userId,
	username,
	onlineStatus,
	handleContextMenu,
}: FriendCardProps) {
	return (
		<div
			className="py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white"
			onContextMenu={handleContextMenu(event, userId)}
		>
			<div className="mx-4 flex items-center gap-3">
				<div className="relative">
					<UserProfile
						imageUrl="/friend-icon.png"
						username={username}
						userId={userId}
						type="default"
					/>
					<OnlineStatus onlineStatus={onlineStatus} />
				</div>
				<div className="truncate text-sm">{username}</div>
			</div>
		</div>
	);
}

export default FriendCard;
