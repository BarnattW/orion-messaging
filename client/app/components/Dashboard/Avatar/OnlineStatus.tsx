import { OnlineStatusProps } from "@/app/types/FriendList";

function OnlineStatus(onlineStatus: OnlineStatusProps) {
	return (
		<>
			<span
				className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${
					onlineStatus.onlineStatus ? "bg-green-500" : "bg-gray-500"
				}`}
			></span>
		</>
	);
}

export default OnlineStatus;
