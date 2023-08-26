import { useState } from "react";

import Switch from "@/app/components/Switch/Switch";

export default function NotificationSettings() {
	const [checked, setChecked] = useState(true);

	function updateSettings() {
		try {
			console.log("updating notification settings");
			setChecked((prevBool) => !prevBool);
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
						<Switch checked={checked} updateSettings={updateSettings} />
					</span>
				</span>
				<span className="text-sm text-neutral-400">
					Toggle to no longer receive notifications
				</span>
			</div>
		</div>
	);
}
