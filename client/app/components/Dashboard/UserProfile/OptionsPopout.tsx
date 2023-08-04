import { useUserStore } from "@/app/store/userStore";
import { OptionsPopoutProps } from "@/app/types/UserProfile";

function OptionsPopout({
	children,
	showOptions,
	userId,
	username,
	currentUserId,
	currentUsername,
}: OptionsPopoutProps) {
	const { friends, enqueueSnackbar } = useUserStore((state) => ({
		friends: state.friends,
		enqueueSnackbar: state.enqueueSnackbar,
	}));
	const isFriends: boolean = friends.some((friend) => friend.userId === userId);

	async function deleteFriend() {
		try {
			let newSnackbar;
			const response = await fetch(`/api/connect/removeFriend`, {
				method: "DELETE",
				body: JSON.stringify({ friendId: userId, userId: currentUserId }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				newSnackbar = {
					type: "error",
					message: "Failed to Delete Friend",
					showSnackbar: true,
				};
			} else {
				newSnackbar = {
					type: "success",
					message: "Successfully Deleted Friend",
					showSnackbar: true,
				};
			}
			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	async function addFriend() {
		try {
			let newSnackbar;
			const response = await fetch("/api/connect/sendFriendRequest", {
				method: "POST",
				body: JSON.stringify({
					senderUsername: username,
					receiverUsername: currentUsername,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				newSnackbar = {
					type: "error",
					message: "Failed to Send Friend Request",
					showSnackbar: true,
				};
			} else {
				newSnackbar = {
					type: "success",
					message: "Friend Request Successfully Sent",
					showSnackbar: true,
				};
			}
			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}

	if (!showOptions) {
		return <div className="relative">{children}</div>;
	}
	return (
		<>
			{isFriends ? (
				<div className="relative">
					{children}
					<div className="absolute top-3/4 select-none rounded bg-zinc-900 px-2 py-2 text-sm text-white outline-none hover:bg-pink-600">
						<button onClick={deleteFriend}>Delete Friend</button>
					</div>
				</div>
			) : (
				<div className="relative">
					{children}
					<div className="absolute bottom-full -ml-5 mb-2 whitespace-nowrap rounded bg-zinc-900 px-2 py-2 text-sm text-white hover:bg-indigo-700">
						<button onClick={addFriend}>Add Friend</button>
					</div>
				</div>
			)}
		</>
	);
}

export default OptionsPopout;
