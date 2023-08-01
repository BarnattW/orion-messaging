import { OnlineStatusProps } from "@/app/types/FriendList";

function OnlineStatus(onlineStatus: OnlineStatusProps) {
	return (
		<>
			<span
				className={`absolute bottom-0 right-0 inline-flex h-3 w-3 rounded-full border-2 border-zinc-800 hover:border-zinc-600 ${
					onlineStatus.onlineStatus ? "bg-green-500" : "bg-gray-500"
				}`}
			></span>
		</>
	);
}

export default OnlineStatus;
