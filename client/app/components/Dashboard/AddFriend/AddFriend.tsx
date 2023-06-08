"use client";
import ListContainer from "../ListContainer";
import { RefObject, useRef, useContext } from "react";
import { UserContext } from "@/app/Context/UserContext";
import FriendRequestCard from "./FriendRequestCard";
import ListHeading from "../ListHeading";

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
			<ListHeading>Friend Requests</ListHeading>
			<FriendRequestCard
				altText="ada"
				userId="31313131"
				username="superduperlongnamefortest"
			/>
			<FriendRequestCard altText="ada" userId="31313131" username="bocondaa" />
			<ListHeading>Sent Requests</ListHeading>
		</ListContainer>
	);
}

export default AddFriend;
