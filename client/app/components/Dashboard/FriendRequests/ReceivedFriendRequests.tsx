import { ReceviedRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../ListWrappers/ListHeading";
import RecievedRequestCard from "./RequestCards/ReceivedRequestCard";

function ReceivedFriendRequests({ receivedRequests }: ReceviedRequestsProps) {
	if (!receivedRequests) {
		return (
			<>
				<ListHeading>Friend Requests</ListHeading>
				<p>No requests found</p>
			</>
		);
	}

	return (
		<>
			<ListHeading>Friend Requests</ListHeading>
			{receivedRequests?.map((ReceivedRequest) => {
				return (
					<RecievedRequestCard
						userId={ReceivedRequest.senderId}
						username={ReceivedRequest.senderUsername}
						requestId={ReceivedRequest._id}
						key={ReceivedRequest._id}
					/>
				);
			})}
		</>
	);
}

export default ReceivedFriendRequests;
