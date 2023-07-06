import { InviteFriendListItemProps } from "@/app/types/FriendList";

import OnlineStatus from "../../Avatar/OnlineStatus";
import UserProfile from "../../UserProfile/UserProfile";

function InviteFriendListItem(friendListItemProps: InviteFriendListItemProps) {
	return (
		<li className="py-2 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
			<div className="flex items-center gap-3">
				<div className="relative z-0">
					<UserProfile
						imageUrl="/friend-icon.png"
						username={friendListItemProps.username}
						userId={friendListItemProps.userId}
						type="default"
					/>
					<OnlineStatus onlineStatus={friendListItemProps.onlineStatus} />
				</div>
				<span className="text-md truncate">{friendListItemProps.username}</span>
			</div>
		</li>
	);
}

export default InviteFriendListItem;
