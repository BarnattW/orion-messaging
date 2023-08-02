import { useUserStore } from "@/app/store/userStore";
import { RequestListItemProps } from "@/app/types/FriendRequests";

import Avatar from "../../Avatar/Avatar";

function SentRequestListItem(friendRequestListItemProps: RequestListItemProps) {
	const { enqueueSnackbar } = useUserStore((state) => ({
		enqueueSnackbar: state.enqueueSnackbar,
	}));
	async function deleteRequest() {
		try {
			let newSnackbar;
			if (friendRequestListItemProps.requestType === "friend") {
				const response = await fetch(
					`/api/connect/rejectFriendRequest/${friendRequestListItemProps.requestId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					newSnackbar = {
						type: "error",
						message: "Failed to Delete Friend Request",
						showSnackbar: true,
					};
				} else {
					newSnackbar = {
						type: "success",
						message: "Deleted Friend Request Successfully",
						showSnackbar: true,
					};
				}
			}
			if (friendRequestListItemProps.requestType === "group") {
				const response = await fetch(
					`/api/connect/rejectGroupRequest/${friendRequestListItemProps.requestId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					newSnackbar = {
						type: "error",
						message: "Failed to Delete Group Request",
						showSnackbar: true,
					};
				} else {
					newSnackbar = {
						type: "success",
						message: "Deleted Group Request Successfully",
						showSnackbar: true,
					};
				}
			}
			if (newSnackbar) enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="max-w-full py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
			<div className="mx-4 flex items-center gap-2 text-xs">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon.svg"
						altText={friendRequestListItemProps.username}
						username={friendRequestListItemProps.username}
						type="default"
					/>
				</div>
				<span className="flex-1 overflow-hidden">
					<div className="truncate">{friendRequestListItemProps.username}</div>
				</span>
				<div className="flex flex-shrink-0 justify-end gap-2">
					<button
						className="bg- text-md rounded-md bg-pink-600 px-2 py-1 hover:bg-pink-500"
						onClick={deleteRequest}
					>
						Delete Request
					</button>
				</div>
			</div>
		</div>
	);
}

export default SentRequestListItem;
