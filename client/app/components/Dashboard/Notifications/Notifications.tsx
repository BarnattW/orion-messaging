import { useEffect, useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";
import getUsername from "@/app/utils/getUsername";

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
	const {
		notifications,
		setNotifications,
		setUsers,
		users,
		addFriends,
		deleteFriends,
		toggleNotifications,
		addReceivedFriendRequest,
	} = useUserStore((state) => ({
		notifications: state.notifications,
		setNotifications: state.setNotifications,
		setUsers: state.setUsers,
		users: state.users,
		addFriends: state.addFriends,
		deleteFriends: state.deleteFriends,
		toggleNotifications: state.toggleNotifications,
		addReceivedFriendRequest: state.addReceivedFriendRequest,
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
		async function receiveFriendRequestUpdates() {
			try {
				// when adding and deleting friends
				await notificationSocket.on(
					"friendrequest-deleted",
					async (friend: { receiverId: string }) => {
						const receiverId = friend.receiverId;
						if (receiverId) {
							if (receiverId in users) return;
							try {
								const username = await getUsername(receiverId);
								setUsers(receiverId, username);
							} catch (error) {
								console.log(
									`Error retrieving username for userId: ${receiverId}`,
									error
								);
							}
							deleteFriends(receiverId);
						}
					}
				);

				await notificationSocket.on(
					"friendrequest-accepted",
					async (friend) => {
						console.log("socjejrqa");
						const receiverId = friend.receiverId;
						console.log(friend);
						if (receiverId) {
							if (receiverId in users) return;
							try {
								const username = await getUsername(receiverId);
								setUsers(receiverId, username);
							} catch (error) {
								console.log(
									`Error retrieving username for userId: ${receiverId}`,
									error
								);
							}
						}
						addFriends(receiverId);
					}
				);

				// ui
				await notificationSocket.on("freq-received", async (socketEvent) => {
					if (!socketEvent) return;
					console.log(socketEvent);
					const { senderId } = socketEvent;
					const username = await getUsername(senderId);
					setUsers(senderId, username);
					addReceivedFriendRequest(socketEvent);
				});
			} catch (error) {
				console.log(error);
			}
		}

		receiveFriendRequestUpdates();

		async function handleNotifications() {
			try {
				await notificationSocket.on(
					"friendRequestReceived",
					async (socketEvent) => {
						if (!socketEvent) return;
						console.log(socketEvent);
						const username = await getUsername(socketEvent.senderId);
						setUsers(socketEvent.senderId, username);
						setNotifications([socketEvent]);
					}
				);
				await notificationSocket.on("messageReceived", async (socketEvent) => {
					if (!socketEvent) return;
					console.log(socketEvent);

					const username = await getUsername(socketEvent.senderId);
					setUsers(socketEvent.senderId, username);
					setNotifications([socketEvent]);
				});
				await notificationSocket.on(
					"groupRequestReceived",
					async (socketEvent) => {
						if (!socketEvent) return;
						console.log(socketEvent);

						const username = await getUsername(socketEvent.senderId);
						setUsers(socketEvent.senderId, username);
						setNotifications([socketEvent]);
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
		handleNotifications();

		return () => {
			notificationSocket.off("friendRequestReceived");
			notificationSocket.off("messageReceived");
			notificationSocket.off("groupRequestReceived");
		};
	}, [setNotifications, setUsers, addFriends, deleteFriends]);

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
						className="fixed z-30 max-h-72 overflow-y-scroll overflow-x-hidden w-80 rounded bg-zinc-700 text-sm text-white scrollbar-thin scrollbar-thumb-neutral-800 pb-4"
						style={{
							top: notificationMenuPosition.y,
							left: notificationMenuPosition.x,
						}}
					>
						<NotificationHeading>Notifications</NotificationHeading>
						<div className="flex flex-col-reverse">
							{notifications.length > 0 && toggleNotifications ? (
								notifications.map((notification) => {
									console.log(notification);
									return (
										<NotificationCard
											key={notification._id}
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
						</div>
					</div>
				)}
			</div>
		</NotificationWrapper>
	);
}

export default Notifications;
