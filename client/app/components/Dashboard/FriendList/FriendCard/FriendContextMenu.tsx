import { ForwardedRef, forwardRef } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { FriendContextMenuProps } from "@/app/types/FriendList";

const FriendContextMenu = forwardRef(function (
	{
		contextMenuPosition,
		closeContextMenu,
		friendId,
		friendUsername,
	}: FriendContextMenuProps,
	ref: ForwardedRef<HTMLDivElement>
) {
	const { friends, userId, username } = useUserStore(
		(state) => ({
			friends: state.friends,
			userId: state.userId,
			username: state.username,
		}),
		shallow
	);
	const isFriends: boolean = friends.some(
		(friend) => friend.userId === friendId
	);

	const messageFriend = () => {
		console.log(`messaging ${friendId}`);
		closeContextMenu();
	};

	async function addFriend() {
		try {
			const response = await fetch("/api/connect/sendFriendRequest", {
				method: "POST",
				body: JSON.stringify({
					senderUsername: username,
					receiverUsername: friendUsername,
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
			closeContextMenu();
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteFriend() {
		try {
			const response = await fetch(`/api/connect/removeFriend`, {
				method: "DELETE",
				body: JSON.stringify({ friendId, userId }),
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
			closeContextMenu();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div
			style={{
				top: contextMenuPosition.y,
				left: contextMenuPosition.x,
			}}
			className="fixed w-32 rounded-md bg-neutral-900 py-2 text-sm text-gray-200 scrollbar-thumb-neutral-800"
			ref={ref}
		>
			<ul>
				<li
					className="rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-indigo-700"
					onClick={messageFriend}
				>
					Message
				</li>
				{isFriends ? (
					<li
						className=" rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-red-700"
						onClick={deleteFriend}
					>
						Delete Friend
					</li>
				) : (
					<li
						className=" rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-indigo-700"
						onClick={addFriend}
					>
						Add Friend
					</li>
				)}
			</ul>
		</div>
	);
});

FriendContextMenu.displayName = "FriendContextMenu";

export default FriendContextMenu;
