import { useUserStore } from "@/app/store/userStore";
import { RequestListItemProps } from "@/app/types/FriendRequests";

import Avatar from "../../Avatar/Avatar";

function ReceivedRequestListItem(
	friendRequestListItemProps: RequestListItemProps
) {
	const { enqueueSnackbar } = useUserStore((state) => ({
		enqueueSnackbar: state.enqueueSnackbar,
	}));
	console.log(friendRequestListItemProps);
	async function acceptRequest() {
		try {
			let newSnackbar;
			if (friendRequestListItemProps.requestType === "friend") {
				const response = await fetch(
					`/api/connect/acceptFriendRequest/${friendRequestListItemProps.requestId}`,
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
						message: "Failed to Accept Friend Request",
						showSnackbar: true,
					};
				} else {
					newSnackbar = {
						type: "success",
						message: "Accepted Friend Request",
						showSnackbar: true,
					};
				}
			}

			if (friendRequestListItemProps.requestType === "group") {
				const response = await fetch(
					`/api/connect/acceptGroupRequest/${friendRequestListItemProps.requestId}`,
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
						message: "Failed to Accept Group Request",
						showSnackbar: true,
					};
				} else {
					newSnackbar = {
						type: "success",
						message: "Accepted Group Request",
						showSnackbar: true,
					};
				}
				enqueueSnackbar(newSnackbar);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteRequest() {
		try {
			let newSnackbar;
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
					message: "Successfully Deleted Friend Request",
					showSnackbar: true,
				};
			} else {
				newSnackbar = {
					type: "success",
					message: "Failed to Delete Friend Request",
					showSnackbar: true,
				};
			}
			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<li className="max-w-full py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
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
						className="text-md rounded-md bg-indigo-600 px-2 py-1 hover:bg-indigo-500"
						onClick={acceptRequest}
					>
						Accept
					</button>
					<button
						className="text-md rounded-md bg-pink-600 px-2 py-1 hover:bg-pink-500"
						onClick={deleteRequest}
					>
						Delete
					</button>
				</div>
			</div>
		</li>
	);
}

export default ReceivedRequestListItem;