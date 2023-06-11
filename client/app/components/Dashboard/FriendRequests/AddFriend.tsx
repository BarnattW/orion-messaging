"use client";
import { RefObject, useRef, useContext } from "react";
import { UserContext } from "@/app/Context/UserContext";
import ListHeading from "../ListWrappers/ListHeading";

function AddFriend() {
	const addUsername: RefObject<HTMLInputElement> = useRef(null);
	const { username } = useContext(UserContext);

	// submitting friend requests
	function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == "Enter") {
			submitFriendRequest();
		}
	}

	async function submitFriendRequest() {
		const receiverUsername = addUsername.current?.value;
		if (receiverUsername === "") return;

		const request = await fetch("/api/connect/sendFriendRequest", {
			method: "POST",
			body: JSON.stringify({
				senderUsername: username,
				receiverUsername: receiverUsername,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (request.ok) {
			// update with common error handling
			console.log(request);
		} else {
			//update the ui
			console.log("sucess", request);
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
