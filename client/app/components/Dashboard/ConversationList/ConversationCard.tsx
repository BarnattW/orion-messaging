import Avatar from "../Avatar/Avatar";

interface FriendCardProps {
	imageUrl?: string;
	altText: string;
	users: string[];
	type: string;
	conversationName: string;
}

function ConversationCard(friendCardProps: FriendCardProps) {
	return (
		<div className="py-3 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white">
			<div className="flex mx-4 gap-3 items-center">
				<div className="relative z-0">
					<Avatar imageUrl="/barn.png" altText={friendCardProps.altText} />
				</div>
				<div className="truncate text-sm">
					{friendCardProps.conversationName}
				</div>
			</div>
		</div>
	);
}

export default ConversationCard;
