import { FriendListItemProps } from "@/app/types/FriendList";

import OnlineStatus from "../../Avatar/OnlineStatus";
import UserProfile from "../../UserProfile/UserProfile";

function FriendListItem({
	imageUrl,
	altText,
	userId,
	username,
	onlineStatus,
	handleContextMenu,
}: FriendListItemProps) {
	const onContextMenuHandler = (event: React.MouseEvent<HTMLLIElement>) => {
		event.preventDefault();
		handleContextMenu(event, { friendId: userId, friendUsername: username });
	};

	return (
		<li
			className="py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white"
			onContextMenu={onContextMenuHandler}
		>
			<div className="mx-4 flex items-center gap-3">
				<span className="relative">
					<UserProfile
						imageUrl="/friend-icon.png"
						username={username}
						userId={userId}
						type="default"
					/>
					<OnlineStatus onlineStatus={onlineStatus} />
				</span>
				<span className="truncate text-sm">{username}</span>
			</div>
		</li>
	);
}

export default FriendListItem;
