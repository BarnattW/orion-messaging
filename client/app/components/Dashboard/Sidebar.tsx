"use client";

import Image from "next/image";
import Link from "next/link";
import FriendIcon from "../Icons/FriendIcon";
import MessageIcon from "../Icons/MessageIcon";
import FriendAddIcon from "../Icons/FriendAddIcon";
import NotificationBellIcon from "../Icons/NotificationBellIcon";
import { usePathname } from "next/navigation";

interface Props {
	userId: string;
}

function Sidebar(props: Props) {
	const { userId } = props;
	const iconClassNames: string = "fill-neutral-500 hover:fill-gray-400 h-6 w-6";
	const activeIconClassNames: string = "fill-gray-100 h-6 w-6";

	const pathname = usePathname();

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
				<FriendIcon
					className={
						pathname.includes("/dashboard/friends")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<Link href={`/dashboard/conversations/${userId}`}>
				<MessageIcon
					className={
						pathname.includes("/dashboard/conversations")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<Link href={`/dashboard/add-friends/${userId}`}>
				<FriendAddIcon
					className={
						pathname.includes("/dashboard/add-friends")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<NotificationBellIcon className={iconClassNames} />
		</div>
	);
}

export default Sidebar;
