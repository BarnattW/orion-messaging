import Image from "next/image";
import Link from "next/link";
import FriendIcon from "../Icons/FriendIcon";
import MessageIcon from "../Icons/MessageIcon";
import FriendAddIcon from "../Icons/FriendAddIcon";
import NotificationBellIcon from "../Icons/NotificationBellIcon";

interface props {
	userId: string;
}

function Sidebar(props: props) {
	const { userId } = props;
	const iconClassNames: string = "fill-gray-100 hover:fill-gray-400 h-6 w-6";

	return (
		<div className="h-full bg-zinc-900 w-16 flex flex-col gap-7 items-center pt-8 flex-shrink-0">
			<Image
				src="/orion-logo2.svg"
				width={80}
				height={80}
				alt="Orion Messaging Logo"
				className="mb-5"
			/>
			<Link href={`/dashboard/friends/${userId}`}>
				<FriendIcon className={iconClassNames} />
			</Link>
			<Link href={`/dashboard/conversations/${userId}`}>
				<MessageIcon className={iconClassNames} />
			</Link>
			<Link href={`/dashboard/add-friends/${userId}`}>
				<FriendAddIcon className={iconClassNames} />
			</Link>
			<NotificationBellIcon className={iconClassNames} />
		</div>
	);
}

export default Sidebar;
