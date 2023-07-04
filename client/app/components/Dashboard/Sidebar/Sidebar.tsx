"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";

import FriendAddIcon from "../../Icons/FriendAddIcon";
import FriendIcon from "../../Icons/FriendIcon";
import GearIcon from "../../Icons/GearIcon";
import LogoutIcon from "../../Icons/LogoutIcon";
import MessageIcon from "../../Icons/MessageIcon";
import Notifications from "../Notifications/Notifications";
import UserProfile from "../UserProfile/UserProfile";
import Tooltip from "./Tooltip";

const iconClassNames: string = "fill-neutral-500 hover:fill-gray-400 h-6 w-6 ";
const activeIconClassNames: string = "fill-gray-100 h-6 w-6";

function Sidebar() {
	const { userId, username } = useUserStore(
		(state) => ({
			userId: state.userId,
			username: state.username,
		}),
		shallow
	);
	const pathname = usePathname();
	const router = useRouter();

	async function logout() {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: null,
			});

			// error handling
			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}

			router.push("/auth/login");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="flex h-full w-16 flex-shrink-0 flex-col items-center gap-7 bg-zinc-900 pt-8">
			<Image
				src="/orion-logo2.svg"
				width={80}
				height={80}
				alt="Orion Messaging Logo"
				className="mb-5"
			/>
			<Notifications />
			<Tooltip content="Friends">
				<Link href={`/dashboard/friends`}>
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
				<Link href={`/dashboard/conversations`}>
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
				<Link href={`/dashboard/add-friends`}>
					<FriendAddIcon
						className={
							pathname.includes("/dashboard/add-friends")
								? activeIconClassNames
								: iconClassNames
						}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Settings">
				<Link href={`/dashboard/settings`}>
					<GearIcon
						className={
							pathname.includes("/dashboard/settings")
								? activeIconClassNames
								: iconClassNames
						}
					/>
				</Link>
			</Tooltip>
			<Tooltip content="Logout">
				<button onClick={logout}>
					<LogoutIcon
						className={`${iconClassNames}stroke-neutral-500 hover:stroke-gray-400`}
					/>
				</button>
			</Tooltip>
			<UserProfile
				username={username ? username : "null"}
				type="default"
				imageUrl=""
				userId={userId ? userId : "null"}
			/>
		</div>
	);
}

export default Sidebar;
