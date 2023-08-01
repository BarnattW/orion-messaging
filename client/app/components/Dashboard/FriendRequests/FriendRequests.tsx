"use client";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { Request } from "@/app/types/FriendRequests";
import getUsername from "@/app/utils/getUsername";

import ListContainer from "../ListWrappers/ListContainer";
import AddFriend from "./AddFriend";
import ReceivedFriendRequests from "./RequestWrappers/ReceivedFriendRequests";
import SentFriendRequests from "./RequestWrappers/SentFriendRequests";

function FriendRequestsList() {
	const { userId, friendRequests, setFriendRequests, setUsers } = useUserStore(
		(state) => ({
			userId: state.userId,
			friendRequests: state.friendRequests,
			setFriendRequests: state.setFriendRequests,
			setUsers: state.setUsers,
		}),
		shallow
	);

	// fetch all incoming and outgoing friend requests
	useEffect(() => {
		async function getRequests() {
			try {
				if (!userId) return;
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

				friendRequests.incoming.forEach(async (receivedRequest: Request) => {
					const { senderId } = receivedRequest;
					const senderUsername = await getUsername(senderId);
					setUsers(senderId, senderUsername);
				});
				friendRequests.outgoing.forEach(async (sentRequest: Request) => {
					const { receiverId } = sentRequest;
					const receiverUsername = await getUsername(receiverId);
					setUsers(receiverId, receiverUsername);
				});

				setFriendRequests({
					receivedRequests: friendRequests.incoming,
					sentRequests: friendRequests.outgoing,
				});
			} catch (error) {
				console.log(error);
			}
		}

		getRequests();
	}, [userId, setFriendRequests, setUsers]);

	return (
		<ListContainer>
			<AddFriend />
			{friendRequests.receivedRequests &&
				friendRequests.receivedRequests.length > 0 && (
					<ReceivedFriendRequests
						receivedRequests={friendRequests.receivedRequests}
					/>
				)}
			{friendRequests.sentRequests &&
				friendRequests.sentRequests.length > 0 && (
					<SentFriendRequests sentRequests={friendRequests.sentRequests} />
				)}
		</ListContainer>
	);
}

export default FriendRequestsList;
