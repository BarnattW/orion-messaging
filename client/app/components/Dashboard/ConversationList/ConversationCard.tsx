import Avatar from "../Avatar/Avatar";

interface ConversationCardProps {
	imageUrl?: string;
	altText: string;
	users: string[];
	type: string;
	conversationName: string;
}

function ConversationCard(conversationCardProps: ConversationCardProps) {
	return (
		<div className="py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white">
			<div className="flex mx-4 gap-3 items-center">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon-blue.png"
						altText={conversationCardProps.altText}
						type="default"
					/>
				</div>
				<div className="truncate text-sm">
					{conversationCardProps.conversationName}
				</div>
			</div>
		</div>
	);
}

export default ConversationCard;
