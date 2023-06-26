import { useState } from "react";
import NotificationHeading from "./NotificationHeading";
import ConversationCard from "../ConversationList/ConversationCard";
import NotificationCard from "./NotificationCard";

function NotificationWrapper({
	children,
	toggleNotifications,
}: {
	children: React.ReactNode;
	toggleNotifications: boolean;
}) {
	return (
		<div className="relative">
			{children}
			{toggleNotifications && (
				<div className="absolute bg-zinc-700 text-white rounded text-sm z-20 left-full ml-2 -my-7 w-52 max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-neutral-800">
					<NotificationHeading>Notifications</NotificationHeading>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
				</div>
			)}
		</div>
	);
}

export default NotificationWrapper;
