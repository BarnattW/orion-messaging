"use client";
import { RefObject, useRef } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";

import ListHeading from "../ListWrappers/ListHeading";

function AddFriend() {
	const addUsername: RefObject<HTMLInputElement> = useRef(null);
	const { username, snackbar, setSnackbar } = useUserStore(
		(state) => ({
			username: state.username,
			snackbar: state.snackbar,
			setSnackbar: state.setSnackbar,
		}),
		shallow
	);

	// submitting friend requests
	function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == "Enter") {
			submitFriendRequest();
		}
	}

	async function submitFriendRequest() {
		const receiverUsername = addUsername.current?.value;
		if (receiverUsername === "") return;

		const response = await fetch("/api/connect/sendFriendRequest", {
			method: "POST",
			body: JSON.stringify({
				senderUsername: username,
				receiverUsername: receiverUsername,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			snackbar.offer({
				type: "success",
				message: "Friend Request Successfully Sent",
				showSnackbar: true,
			});
			setSnackbar(snackbar);
		} else {
			snackbar.offer({
				type: "error",
				message: "Failed to Send Friend Request",
				showSnackbar: true,
			});
			setSnackbar(snackbar);
		}
		addUsername.current!.value = "";
	}

	return (
		<>
			<ListHeading>Add Friends</ListHeading>
			<input
				ref={addUsername}
				className="mx-5 mb-1 rounded-md bg-zinc-700 p-1 outline-none"
				placeholder="Search username"
				onKeyDown={keyDownHandler}
			></input>
			<button
				className="text-md mx-10 rounded-md bg-indigo-600 py-1 hover:bg-indigo-500"
				onClick={submitFriendRequest}
			>
				Send Friend Request
			</button>
		</>
	);
}

export default AddFriend;
