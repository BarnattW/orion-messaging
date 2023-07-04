import { ReceviedRequestsProps } from "@/app/types/FriendRequests";

import RecievedRequestCard from "../FriendRequests/RequestCards/ReceivedRequestCard";
import ListHeading from "../ListWrappers/ListHeading";

function ReceivedGroupRequests({ receivedRequests }: ReceviedRequestsProps) {
	if (!receivedRequests) {
		return (
			<>
				<ListHeading>Group Invites</ListHeading>
				<p>No requests found</p>
			</>
		);
	}

	return (
		<>
			<ListHeading>Group Invites</ListHeading>
			{receivedRequests?.map((receivedRequest) => {
				return (
					<RecievedRequestCard
						userId={receivedRequest.senderId}
						username={receivedRequest.senderUsername}
						requestId={receivedRequest._id}
						key={receivedRequest._id}
						requestType={receivedRequest.requestType}
					/>
				);
			})}
		</>
	);
}

export default ReceivedGroupRequests;
