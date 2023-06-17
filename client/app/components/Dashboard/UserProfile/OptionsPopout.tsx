import { UserContext } from "@/app/Context/UserContext";
import { OptionsPopoutProps } from "@/app/types/UserProfile";
import { useContext } from "react";

function OptionsPopout({
	children,
	showOptions,
	userId,
	username,
	currentUserId,
	currentUsername,
}: OptionsPopoutProps) {
	const { friends } = useContext(UserContext);
    const isFriends: boolean = friends.some(
			(friend) => friend.userId === userId
		);

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

		if (currentUserId === userId) {
			return <div className="relative">{children}</div>;
		}

		if (isFriends) {
			return (
				<div className="relative">
					{children}
					<div className="absolute bg-zinc-900 hover:bg-red-700 text-white px-2 py-2 rounded text-sm top-3/4 left-40 outline-none select-none">
						<button onClick={deleteFriend}>Delete Friend</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="relative">
					{children}
					<div className="absolute bg-zinc-900 hover:bg-red-700 text-white px-2 py-2 rounded text-sm top-3/4 left-40">
						<button onClick={addFriend}>Add Friend</button>
					</div>
				</div>
			);
		}
	return <div className="relative">{children}</div>;
}

export default OptionsPopout;
