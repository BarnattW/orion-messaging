"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
	const { userId, username } = useUserStore((state) => ({
		userId: state.userId,
		username: state.username,
	}));
	const pathname = usePathname();
	const router = useRouter();
	const [showTooltip, setShowTooltip] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const [content, setContent] = useState<string | null>(null);

	const handleTooltip = (
		event:
			| React.MouseEvent<HTMLAnchorElement>
			| React.MouseEvent<HTMLButtonElement>,
		content: string
	) => {
		const iconWidth = 12;
		const sidebarRect = event.currentTarget.closest(".flex");
		if (sidebarRect) {
			const rect = sidebarRect.getBoundingClientRect();
			const x = rect.width - iconWidth;
			const y = event.currentTarget.offsetTop;
			setContextMenuPosition({ x, y });
			setShowTooltip(true);
			setContent(content);
		}
	};

	const handleTooltipLeave = () => {
		setShowTooltip(false);
		setContent(null);
	};

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
		<div className="flex h-full w-16 flex-shrink-0 flex-col items-center gap-7 overflow-scroll bg-zinc-900 py-8 scrollbar-none">
			<Image
				src="/orion-logo2.svg"
				width={80}
				height={80}
				alt="Orion Messaging Logo"
				className="mb-5"
			/>
			<Notifications />
			<Link
				href={`/dashboard/friends`}
				onMouseEnter={(event) => {
					handleTooltip(event, "Friends");
				}}
				onMouseLeave={handleTooltipLeave}
			>
				<FriendIcon
					className={
						pathname.includes("/dashboard/friends")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<Link
				href={`/dashboard/conversations`}
				onMouseEnter={(event) => {
					handleTooltip(event, "Messages");
				}}
				onMouseLeave={handleTooltipLeave}
			>
				<MessageIcon
					className={
						pathname.includes("/dashboard/conversations")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<Link
				href={`/dashboard/add-friends`}
				onMouseEnter={(event) => {
					handleTooltip(event, "Add Friends");
				}}
				onMouseLeave={handleTooltipLeave}
			>
				<FriendAddIcon
					className={
						pathname.includes("/dashboard/add-friends")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<Link
				href={`/dashboard/settings`}
				onMouseEnter={(event) => {
					handleTooltip(event, "Settings");
				}}
				onMouseLeave={handleTooltipLeave}
			>
				<GearIcon
					className={
						pathname.includes("/dashboard/settings")
							? activeIconClassNames
							: iconClassNames
					}
				/>
			</Link>
			<button
				onClick={logout}
				onMouseEnter={(event) => {
					handleTooltip(event, "Logout");
				}}
				onMouseLeave={handleTooltipLeave}
			>
				<LogoutIcon
					className={`${iconClassNames}stroke-neutral-500 hover:stroke-gray-400`}
				/>
			</button>
			<UserProfile
				username={username ? username : "null"}
				type="default"
				imageUrl=""
				userId={userId ? userId : "null"}
			/>
			{showTooltip && content && (
				<Tooltip content={content} contextMenuPosition={contextMenuPosition} />
			)}
		</div>
	);
}

export default Sidebar;
