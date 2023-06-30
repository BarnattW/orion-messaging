import { useState } from "react";

import NotificationBellIcon from "../../Icons/NotificationBellIcon";
import NotificationWrapper from "./NotificationWrapper";

function Notifications() {
	const iconClassNames: string =
		"fill-neutral-500 hover:fill-gray-400 h-6 w-6 hover: cursor-pointer";
	const [toggleNotifications, setToggleNotifications] = useState(false);

	function handleNotificationClick() {
		setToggleNotifications((prevBool) => !prevBool);
	}

	return (
		<NotificationWrapper toggleNotifications={toggleNotifications}>
			<div onClick={handleNotificationClick}>
				<NotificationBellIcon className={iconClassNames} />
			</div>
		</NotificationWrapper>
	);
}

export default Notifications;
