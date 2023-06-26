import { FriendCardProps } from "@/app/types/FriendList";

import OnlineStatus from "../Avatar/OnlineStatus";
import UserProfile from "../UserProfile/UserProfile";

function InviteFriendCard(friendCardProps: FriendCardProps) {
	return (
		<div className="py-2 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
			<div className="flex items-center gap-3">
				<div className="relative z-0">
					<UserProfile
						imageUrl="/friend-icon.png"
						username={friendCardProps.username}
						userId={friendCardProps.userId}
						type="default"
					/>
					<OnlineStatus onlineStatus={friendCardProps.onlineStatus} />
				</div>
				<div className="text-md truncate">{friendCardProps.username}</div>
			</div>
		</div>
	);
}

export default InviteFriendCard;
