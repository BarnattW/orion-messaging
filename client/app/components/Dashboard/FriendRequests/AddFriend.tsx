"use client";
import { RefObject, useRef } from "react";

import { useUserStore } from "@/app/store/userStore";

import ListHeading from "../ListWrappers/ListHeading";

function AddFriend() {
	const addUsername: RefObject<HTMLInputElement> = useRef(null);
	const username = useUserStore((state) => state.username);

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
			// update with common error handling
			console.log(response);
		} else {
			//update the ui
			console.log(response);
		}
		addUsername.current!.value = "";
	}

	return (
		<>
			<ListHeading>Add Friends</ListHeading>
			<input
				ref={addUsername}
				className="mx-5 rounded-md bg-zinc-700 p-1 outline-none"
				placeholder="Search username"
				onKeyDown={keyDownHandler}
			></input>
			<button
				className="bg- text-md mx-10 rounded-md bg-indigo-600 py-1 hover:bg-indigo-500"
				onClick={submitFriendRequest}
			>
				Send Friend Request
			</button>
		</>
	);
}

export default AddFriend;
