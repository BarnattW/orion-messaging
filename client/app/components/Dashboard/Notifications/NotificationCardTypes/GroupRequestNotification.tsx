import notificationSocket from "@/app/sockets/notificationSocket";
import { useUserStore } from "@/app/store/userStore";
import { RequestNotificationsProps } from "@/app/types/Notifications";

function GroupRequestNotification({
	timestamp,
	message,
	receiverId,
	conversationName,
	requestId,
	_id,
	senderId,
}: RequestNotificationsProps) {
	const {
		enqueueSnackbar,
		deleteNotifications,
		users,
		deleteReceivedGroupRequest,
	} = useUserStore((state) => ({
		enqueueSnackbar: state.enqueueSnackbar,
		deleteNotifications: state.deleteNotifications,
		users: state.users,
		deleteReceivedGroupRequest: state.deleteReceivedGroupRequest,
	}));

	async function acceptRequest() {
		try {
			let newSnackbar;

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

				notificationSocket.emit("deleteNotification", _id);
				deleteNotifications(_id);
				deleteReceivedGroupRequest(_id);
			}
			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteRequest() {
		try {
			let newSnackbar;
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
				notificationSocket.emit("deleteNotification", _id);
				deleteNotifications(_id);
				deleteReceivedGroupRequest(_id);
			}

			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="text-sm flex flex-col w-2/3">
			<span>{`${users[senderId].username} invited you to group ${conversationName}`}</span>
			<span className="text-xs text-neutral-200">
				{timestamp.toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</span>
			<span className="flex flex-shrink-0 gap-2 mt-2">
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
			</span>
		</div>
	);
}

export default GroupRequestNotification;
