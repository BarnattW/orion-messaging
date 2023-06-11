import Avatar from "../Avatar/Avatar";
import OnlineStatus from "../Avatar/OnlineStatus";
import { FriendCardProps } from "@/app/types/FriendList";

function FriendCard(friendCardProps: FriendCardProps) {
	return (
		<div className="py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white">
			<div className="flex mx-4 gap-3 items-center">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon.svg"
						altText={friendCardProps.altText}
					/>
					<OnlineStatus onlineStatus={friendCardProps.onlineStatus} />
				</div>
				<div className="truncate text-sm">{friendCardProps.username}</div>
			</div>
		</div>
	);
}

export default FriendCard;
