import { ReceviedRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../../ListWrappers/ListHeading";
import RecievedRequestListItem from "../RequestListItem/ReceivedRequestListItem";

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
			<ul>
				{receivedRequests?.map((ReceivedRequest) => {
					return (
						<RecievedRequestListItem
							userId={ReceivedRequest.senderId}
							username={ReceivedRequest.senderUsername}
							requestId={ReceivedRequest._id}
							key={ReceivedRequest._id}
							requestType={ReceivedRequest.requestType}
						/>
					);
				})}
			</ul>
		</>
	);
}

export default ReceivedFriendRequests;
