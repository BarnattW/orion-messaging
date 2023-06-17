import Avatar from "../Avatar/Avatar";
import UserProfile from "../UserProfile/UserProfile";

interface NotificationCardProps {
	imageUrl?: string;
	altText: string;
	users: string[];
	type: string;
	conversationName: string;
}

function NotificationCard(notificationCardProps: NotificationCardProps) {
	return (
		<div className="py-2 pl-1 hover:bg-zinc-800 hover:text-neutral-50 hover:cursor-pointer focus:bg-white">
			<div className="flex mx-4 gap-3 items-center">
				<div className="relative z-0">
					<UserProfile
						imageUrl="/friend-icon-blue.png"
						userId="a"
						username="a"
						type="default"
					/>
				</div>
				<div className="truncate text-sm">
					{notificationCardProps.conversationName}
				</div>
			</div>
		</div>
	);
}

export default NotificationCard;
