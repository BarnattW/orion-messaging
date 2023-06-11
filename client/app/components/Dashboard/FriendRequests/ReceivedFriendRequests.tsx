import ListHeading from "../ListHeading";
import RecievedRequestCard from "./RequestCards/ReceivedRequestCard";
import { receviedRequestsProps } from "@/app/types/FriendRequests";

function ReceivedFriendRequests({ receivedRequests }: receviedRequestsProps) {
	return (
		<>
			<ListHeading>Friend Requests</ListHeading>
			{receivedRequests.map((receivedRequest) => {
				<RecievedRequestCard
					userId={receivedRequest.receiverId}
					username={receivedRequest.receiverUsername}
					requestId={receivedRequest._id}
					key={receivedRequest._id}
				/>;
			})}
		</>
	);
}

export default ReceivedFriendRequests;
