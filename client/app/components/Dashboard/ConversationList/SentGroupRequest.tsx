import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

import SentRequestListItem from "../FriendRequests/RequestListItem/SentRequestListItem";
import ListHeading from "../ListWrappers/ListHeading";

function SentGroupRequests({ sentRequests }: SentFriendRequestsProps) {
	if (!sentRequests) {
		return (
			<>
				<ListHeading>Sent Requests</ListHeading>
				<p>No requests found</p>
			</>
		);
	}

	return (
		<>
			<ListHeading>Sent Requests</ListHeading>
			{sentRequests.map((sentRequest) => {
				return (
					<SentRequestListItem
						userId={sentRequest.receiverId}
						username={sentRequest.receiverUsername}
						requestId={sentRequest._id}
						key={sentRequest._id}
						requestType={sentRequest.requestType}
					/>
				);
			})}
		</>
	);
}

export default SentGroupRequests;
