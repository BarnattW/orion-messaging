import { useEffect, useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";

import NotificationBellIcon from "../../Icons/NotificationBellIcon";
import NotificationCard from "./NotificationCard";
import NotificationHeading from "./NotificationHeading";
import NotificationWrapper from "./NotificationWrapper";

function Notifications() {
	const iconClassNames: string =
		"fill-neutral-500 hover:fill-gray-400 h-6 w-6 hover:cursor-pointer";
	const { isComponentVisible, setIsComponentVisible, ref } =
		useComponentVisible(false);
	const [notificationMenuPosition, setNotificationMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const { notifications, setNotifications } = useUserStore((state) => ({
		notifications: state.notifications,
		setNotifications: state.setNotifications,
	}));

	function handleNotificationClick(event: React.MouseEvent<HTMLDivElement>) {
		const bellIconRect = event.currentTarget.getBoundingClientRect();
		const x = bellIconRect.right + 12;
		const y = bellIconRect.top;
		setNotificationMenuPosition({ x, y });
		setIsComponentVisible((prevBool) => !prevBool);
	}

	useEffect(() => {
		async function handleNotifications() {
			try {
				await notificationSocket.on("friendRequestReceived", (socketEvent) => {
					if (!socketEvent) return;
					console.log(socketEvent);
					setNotifications([socketEvent]);
				});
				await notificationSocket.on("messageReceived", (socketEvent) => {
					if (!socketEvent) return;
					console.log(socketEvent);
					setNotifications([socketEvent]);
				});
			} catch (error) {
				console.log(error);
			}
		}
		handleNotifications();

		return () => {
			notificationSocket.off("friendRequestReceived");
		};
	}, [setNotifications]);

	return (
		<NotificationWrapper>
			<div onClick={handleNotificationClick} ref={ref}>
				<NotificationBellIcon className={iconClassNames} />
				{isComponentVisible && (
					<div
						className="fixed z-30 max-h-72 w-52 overflow-auto rounded bg-zinc-700 text-sm text-white scrollbar-thin scrollbar-thumb-neutral-800"
						style={{
							top: notificationMenuPosition.y,
							left: notificationMenuPosition.x,
						}}
					>
						<NotificationHeading>Notifications</NotificationHeading>
						{notifications.map((notification) => {
							return (
								<NotificationCard
									key={notification.message}
									altText={notification.message}
									users={["a"]}
									type="default"
									conversationName="vanyDOG"
								/>
							);
						})}
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
							conversationName="admaodmaodamdaomdaomdoadamdoad"
						/>
					</div>
				)}
			</div>
		</NotificationWrapper>
	);
}

export default Notifications;
