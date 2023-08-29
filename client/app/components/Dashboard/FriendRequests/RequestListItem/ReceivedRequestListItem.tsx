import { useUserStore } from "@/app/store/userStore";
import { RequestListItemProps } from "@/app/types/FriendRequests";
import getUsername from "@/app/utils/getUsername";

import Avatar from "../../Avatar/Avatar";

function ReceivedRequestListItem({
	userId,
	requestType,
	requestId,
	username,
}: RequestListItemProps) {
	const {
		enqueueSnackbar,
		addFriends,
		setUsers,
		deleteReceivedFriendRequest,
		deleteReceivedGroupRequests,
	} = useUserStore((state) => ({
		enqueueSnackbar: state.enqueueSnackbar,
		addFriends: state.addFriends,
		users: state.users,
		setUsers: state.setUsers,
		deleteReceivedFriendRequest: state.deleteReceivedFriendRequest,
		deleteReceivedGroupRequests: state.deleteReceivedGroupRequest,
	}));

	async function acceptRequest() {
		try {
			let newSnackbar;
			if (requestType === "friend") {
				const response = await fetch(
					`/api/connect/acceptFriendRequest/${requestId}`,
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
				enqueueSnackbar(newSnackbar);
				const username = await getUsername(userId);
				setUsers(userId, username);
				addFriends(userId);
				deleteReceivedFriendRequest(requestId);
			}

			if (requestType === "group") {
				const response = await fetch(
					`/api/connect/acceptGroupRequest/${requestId}`,
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
				deleteReceivedGroupRequests(requestId);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteRequest() {
		try {
			let newSnackbar;
			if (requestType === "friend") {
				const response = await fetch(
					`/api/connect/rejectFriendRequest/${requestId}`,
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
						message: "Successfully Deleted Friend Request",
						showSnackbar: true,
					};
				}
				enqueueSnackbar(newSnackbar);
				deleteReceivedFriendRequest(requestId);
			}
			if (requestType === "group") {
				const response = await fetch(
					`/api/connect/rejectGroupRequest/${requestId}`,
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
						message: "Successfully Deleted Group Request",
						showSnackbar: true,
					};
				}
				enqueueSnackbar(newSnackbar);
				deleteReceivedGroupRequests(requestId);
			}
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
						altText={username}
						username={username}
						type="default"
					/>
				</div>
				<span className="flex-1 overflow-hidden">
					<div className="truncate">{username}</div>
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
