import { FriendCardProps } from "@/app/types/FriendList";

import OnlineStatus from "../Avatar/OnlineStatus";
import UserProfile from "../UserProfile/UserProfile";

function FriendCard(friendCardProps: FriendCardProps) {
	return (
		<div className="py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
			<div className="mx-4 flex items-center gap-3">
				<div className="relative z-0">
					<UserProfile
						imageUrl="/friend-icon.png"
						username={friendCardProps.username}
						userId={friendCardProps.userId}
						type="default"
					/>
					<OnlineStatus onlineStatus={friendCardProps.onlineStatus} />
				</div>
				<div className="truncate text-sm">{friendCardProps.username}</div>
			</div>
		</div>
	);
}

export default FriendCard;
