import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../../ListWrappers/ListHeading";
import SentRequestListItem from "../RequestListItem/SentRequestListItem";

function SentFriendRequests({ sentRequests }: SentFriendRequestsProps) {
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
			<ul>
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
			</ul>
		</>
	);
}

export default SentFriendRequests;
