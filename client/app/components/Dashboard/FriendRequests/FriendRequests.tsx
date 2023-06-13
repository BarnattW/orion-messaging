"use client";
import ListContainer from "../ListWrappers/ListContainer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/Context/UserContext";
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
			try {
				const response = await fetch(`/api/connect/${userId}/getFriendReqs`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					// update with common error handling
					console.log(response);
				}

				const friendRequests = await response.json();
				setFriendRequests({
					receivedRequests: friendRequests.incoming,
					sentRequests: friendRequests.outgoing,
				});
			} catch (error) {
				console.log(error);
			}
		}

		getRequests();
	}, [userId]);

	return (
		<ListContainer>
			<AddFriend />
			<ReceivedFriendRequests
				receivedRequests={friendRequests.receivedRequests}
			/>
			<SentFriendRequests sentRequests={friendRequests.sentRequests} />
		</ListContainer>
	);
}

export default FriendRequests;
