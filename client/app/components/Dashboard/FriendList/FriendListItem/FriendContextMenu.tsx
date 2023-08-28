import { ForwardedRef, forwardRef } from "react";

import ConfirmationDialogBox from "@/app/components/Dialog/ConfirmationDialogBox";
import DialogWrapper from "@/app/components/Dialog/DialogWrapper";
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
	const { friends, userId, username, enqueueSnackbar, deleteFriends } =
		useUserStore((state) => ({
			friends: state.friends,
			userId: state.userId,
			username: state.username,
			enqueueSnackbar: state.enqueueSnackbar,
			deleteFriends: state.deleteFriends,
		}));
	const isFriends: boolean = friends.some(
		(friend) => friend.userId === friendId
	);

	const messageFriend = () => {
		console.log(`messaging ${friendId}`);
		closeContextMenu();
	};

	async function addFriend() {
		try {
			let newSnackbar;
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
			closeContextMenu();
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteFriend() {
		try {
			let newSnackbar;
			const response = await fetch(`/api/connect/removeFriend`, {
				method: "DELETE",
				body: JSON.stringify({ friendId, userId }),
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
			deleteFriends(friendId);
			console.log(friends);
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
					<DialogWrapper
						content={
							<ConfirmationDialogBox
								heading="Delete Friend?"
								message={`Are you sure you want to remove ${friendUsername} as a friend?`}
								cancelText="Cancel"
								confirmText="Delete"
								onCancel={closeContextMenu}
								onConfirm={deleteFriend}
							/>
						}
						trigger={
							<li className="rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-pink-600">
								Delete Friend
							</li>
						}
					/>
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
