import Switch from "@/app/components/Switch/Switch";
import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";

export default function NotificationSettings() {
	const { toggleNotifications, userId, setToggleNotifications } = useUserStore(
		(state) => ({
			toggleNotifications: state.toggleNotifications,
			userId: state.userId,
			setToggleNotifications: state.setToggleNotifications,
		})
	);

	function updateSettings() {
		try {
			console.log("updating notification settings");
			notificationSocket.emit("toggleNotifications", {
				userId,
				bool: toggleNotifications,
			});
			notificationSocket.on("preferences", (toggleNotifications: boolean) => {
				console.log("toggle notifications:", toggleNotifications);
				setToggleNotifications(toggleNotifications);
			});
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="w-2/3">
			<div className="flex flex-col w-full">
				<span className="flex justify-between">
					Enable Notifications{" "}
					<span>
						<Switch
							checked={toggleNotifications}
							updateSettings={updateSettings}
						/>
					</span>
				</span>
				<span className="text-sm text-neutral-400">
					Toggle to no longer receive notifications
				</span>
			</div>
		</div>
	);
}
