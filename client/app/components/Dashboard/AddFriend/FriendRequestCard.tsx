import Avatar from "../Avatar/Avatar";

interface FriendRequestCardProps {
	imageUrl?: string;
	altText: string;
	userId: string;
	username: string;
}

function FriendRequestCard(friendRequestCardProps: FriendRequestCardProps) {
	return (
		<div className="py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white max-w-full">
			<div className="flex mx-4 gap-2 items-center text-xs">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon.svg"
						altText={friendRequestCardProps.altText}
					/>
				</div>
				<div className="flex-1 overflow-hidden">
					<div className="truncate">{friendRequestCardProps.username}</div>
				</div>
				<div className="flex gap-2 justify-end flex-shrink-0">
					<button className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 bg- text-md">
						Confirm
					</button>
					<button className="px-2 py-1 rounded-md bg-pink-600 hover:bg-pink-500 bg- text-md">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default FriendRequestCard;
