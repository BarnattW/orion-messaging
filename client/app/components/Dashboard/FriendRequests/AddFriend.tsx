"use client";
import { RefObject, useRef } from "react";
import ListHeading from "../ListWrappers/ListHeading";
import { useUserStore } from "@/app/store/userStore";
import { shallow } from "zustand/shallow";

function AddFriend() {
	const addUsername: RefObject<HTMLInputElement> = useRef(null);
	const { username } = useUserStore(
		(state) => ({ username: state.username }),
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
				className="mx-5 bg-zinc-700 outline-none rounded-md p-1"
				placeholder="Search username"
				onKeyDown={keyDownHandler}
			></input>
			<button
				className="mx-10 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 bg- text-md"
				onClick={submitFriendRequest}
			>
				Send Friend Request
			</button>
		</>
	);
}

export default AddFriend;
