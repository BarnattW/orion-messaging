"use client";
import ListContainer from "../ListWrappers/ListContainer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/Context/UserContext";
import RequestCard from "./RequestCard";
import ReceivedFriendRequests from "./ReceivedFriendRequests";
import AddFriend from "./AddFriend";
import SentFriendRequests from "./SentFriendRequests";
import { FriendRequests } from "@/app/types/FriendRequests";

function FriendRequests() {
	const { userId } = useContext(UserContext);
	const [friendRequests, setFriendRequests] = useState<FriendRequests>({
		receivedRequests: [],
		sentRequests: [],
	});

	// fetch all incoming and outgoing friend requests
	useEffect(() => {
		async function getRequests() {
			const response = await fetch(`/api/${userId}/getFriendReqs`);
			const friendRequests = await response.json();

			if (friendRequests.status != 200) {
				// update with common error handling
				console.log(friendRequests);
			}

			setFriendRequests({
				receivedRequests: friendRequests.outgoing,
				sentRequests: friendRequests.incoming,
			});
		}

		getRequests();
	}, [userId]);

	return (
		<ListContainer>
			<AddFriend />
			<ReceivedFriendRequests
				receivedRequests={friendRequests.receivedRequests}
			/>
			<RequestCard
				altText="ada"
				userId="31313131"
				username="superduperlongnamefortest"
			/>
			<RequestCard altText="ada" userId="31313131" username="bocondaa" />
			<SentFriendRequests sentRequests={friendRequests.sentRequests} />
		</ListContainer>
	);
}

export default FriendRequests;
