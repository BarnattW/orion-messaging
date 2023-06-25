import { shallow } from "zustand/shallow";

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
	const { friends } = useUserStore(
		(state) => ({ friends: state.friends }),
		shallow
	);
	const isFriends: boolean = friends.some((friend) => friend.userId === userId);

	async function deleteFriend() {
		try {
			const response = await fetch(`/api/connect/removeFriend`, {
				method: "DELETE",
				body: JSON.stringify({ friendId: userId, userId: currentUserId }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// update with common error handling
				console.log(response);
			} else {
				// update ui
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function addFriend() {
		try {
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
				// update with common error handling
				console.log(response);
			} else {
				// update ui
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	}

	if (!showOptions) {
		return <div className="relative">{children}</div>;
	}

	if (isFriends) {
		return (
			<div className="relative">
				{children}
				<div className="absolute left-40 top-3/4 select-none rounded bg-zinc-900 px-2 py-2 text-sm text-white outline-none hover:bg-red-700">
					<button onClick={deleteFriend}>Delete Friend</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="relative">
				{children}
				<div className="absolute left-40 top-3/4 rounded bg-zinc-900 px-2 py-2 text-sm text-white hover:bg-red-700">
					<button onClick={addFriend}>Add Friend</button>
				</div>
			</div>
		);
	}
}

export default OptionsPopout;
