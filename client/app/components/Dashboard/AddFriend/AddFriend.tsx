"use client";
import ListContainer from "../ListContainer";
import { RefObject, useRef, useContext } from "react";
import { UserContext } from "@/app/Context/UserContext";

function AddFriend() {
	const addUsername: RefObject<HTMLInputElement> = useRef(null);
	const { userId } = useContext(UserContext);

	function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == "Enter") {
			submitFriendRequest();
		}
	}

	async function submitFriendRequest() {
		if (addUsername.current?.value === "") return;

		console.log("creating request!");
	}

	return (
		<ListContainer>
			<div className="text-lg px-5 bg-zinc-800  sticky top-0 pt-8 pb-1 backdrop-blur-lg z-10">
				Add Friends
			</div>
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
		</ListContainer>
	);
}

export default AddFriend;
