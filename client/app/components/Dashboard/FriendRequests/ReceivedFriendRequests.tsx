import ListHeading from "../ListWrappers/ListHeading";
import RecievedRequestCard from "./RequestCards/ReceivedRequestCard";
import { receviedRequestsProps } from "@/app/types/FriendRequests";

function ReceivedFriendRequests({ receivedRequests }: receviedRequestsProps) {
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
			{receivedRequests?.map((receivedRequest) => {
				return (
					<RecievedRequestCard
						userId={receivedRequest.senderId}
						username={receivedRequest.senderUsername}
						requestId={receivedRequest._id}
						key={receivedRequest._id}
					/>
				);
			})}
		</>
	);
}

export default ReceivedFriendRequests;
