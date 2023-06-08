"use client";

import Image from "next/image";
import Link from "next/link";
import FriendIcon from "../Icons/FriendIcon";
import MessageIcon from "../Icons/MessageIcon";
import FriendAddIcon from "../Icons/FriendAddIcon";
import NotificationBellIcon from "../Icons/NotificationBellIcon";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import LogoutIcon from "../Icons/LogoutIcon";
import Tooltip from "../Tooltip";
import { useContext } from "react";
import { UserContext } from "@/app/Context/UserContext";

function Sidebar() {
	const { userId } = useContext(UserContext);
	const iconClassNames: string = "fill-neutral-500 hover:fill-gray-400 h-6 w-6";
	const activeIconClassNames: string = "fill-gray-100 h-6 w-6";

	const pathname = usePathname();
	const router = useRouter();

	async function logout() {
		const response = await fetch("/api/auth/logout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: null,
		});
		router.push("/auth/login");
	}

	return (
		<div className="h-full bg-zinc-900 w-16 flex flex-col gap-7 items-center pt-8 flex-shrink-0">
			<Image
				src="/orion-logo2.svg"
				width={80}
				height={80}
				alt="Orion Messaging Logo"
				className="mb-5"
			/>
			<Tooltip content="Friends">
				<Link href={`/dashboard/friends/${userId}`}>
					<FriendIcon
						className={
							pathname.includes("/dashboard/friends")
								? activeIconClassNames
								: iconClassNames
						}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Messages">
				<Link href={`/dashboard/conversations/${userId}`}>
					<MessageIcon
						className={
							pathname.includes("/dashboard/conversations")
								? activeIconClassNames
								: iconClassNames
						}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Add Friends">
				<Link href={`/dashboard/add-friends/${userId}`}>
					<FriendAddIcon
						className={
							pathname.includes("/dashboard/add-friends")
								? activeIconClassNames
								: iconClassNames
						}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Notifications">
				<NotificationBellIcon className={iconClassNames} />
			</Tooltip>
			<Tooltip content="Logout">
				<button onClick={logout}>
					<LogoutIcon className={iconClassNames} color="#737373" />
				</button>
			</Tooltip>
		</div>
	);
}

export default Sidebar;
