"use client";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { FriendRequests } from "@/app/types/FriendRequests";

import ListContainer from "../ListWrappers/ListContainer";
import AddFriend from "./AddFriend";
import ReceivedFriendRequests from "./ReceivedFriendRequests";
import ReceivedGroupRequests from "./ReceivedGroupRequests";
import SentFriendRequests from "./SentFriendRequests";

function FriendRequests() {
	const { userId } = useUserStore(
		(state) => ({ userId: state.userId }),
		shallow
	);
	const [friendRequests, setFriendRequests] = useState<FriendRequests>({
		receivedRequests: [],
		sentRequests: [],
	});
	const [groupRequests, setGroupRequests] = useState<FriendRequests>({
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

				const responseGroup = await fetch(
					`/api/connect/${userId}/getGroupReqs`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					// update with common error handling
					console.log(response);
				}
				const groupRequests = await responseGroup.json();
				setGroupRequests({
					receivedRequests: groupRequests.incoming,
					sentRequests: groupRequests.outgoing,
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
			<ReceivedGroupRequests
				receivedRequests={groupRequests.receivedRequests}
			/>
		</ListContainer>
	);
}

export default FriendRequests;
