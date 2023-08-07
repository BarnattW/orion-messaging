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
	console.log(notifications);
	function handleNotificationToggle(event: React.MouseEvent<HTMLDivElement>) {
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
				await notificationSocket.on("groupRequestReceived", (socketEvent) => {
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
			notificationSocket.off("messageReceived");
		};
	}, [setNotifications]);

	return (
		<NotificationWrapper>
			<div ref={ref}>
				<div
					onClick={handleNotificationToggle}
					className="hover:cursor-pointer"
				>
					<NotificationBellIcon className={iconClassNames} />
					<span
						className={`absolute -bottom-1 right-0 inline-flex h-3 w-3 rounded-full border-2 border-zinc-800 ${
							notifications.length > 0 ? "bg-red-500" : "hidden"
						}
						`}
					></span>
				</div>
				{isComponentVisible && (
					<div
						className="fixed z-30 max-h-72 w-80 rounded bg-zinc-700 text-sm text-white scrollbar-thin scrollbar-thumb-neutral-800 pb-4"
						style={{
							top: notificationMenuPosition.y,
							left: notificationMenuPosition.x,
						}}
					>
						<NotificationHeading>Notifications</NotificationHeading>
						<div className="flex flex-col-reverse">
							{notifications.length > 0 ? (
								notifications.map((notification) => {
									return (
										<NotificationCard
											key={notification.message}
											altText={notification.message}
											receiverId={notification.receiverId}
											type={notification.type}
											conversationName={notification.conversationName}
											message={notification.message}
											timestamp={notification.timestamp}
											senderId={notification.senderId}
											_id={notification._id}
											requestId={notification.requestId}
											conversationId={notification.conversationId}
										/>
									);
								})
							) : (
								<p className="px-5">No notifications found.</p>
							)}
							<NotificationCard
								altText="dummy"
								receiverId="cat"
								type="message"
								conversationName="a"
								message="oh no, stinky"
								timestamp={new Date()}
								requestId="c"
								conversationId="b"
								senderId="bobby"
								_id="ddada"
							/>
							<NotificationCard
								altText="dummy"
								receiverId="cat"
								type="friend"
								conversationName="a"
								message="ohday"
								timestamp={new Date()}
								requestId="c"
								conversationId="b"
								senderId="bob"
								_id="ddada"
							/>
						</div>
					</div>
				)}
			</div>
		</NotificationWrapper>
	);
}

export default Notifications;
