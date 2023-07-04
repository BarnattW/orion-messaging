import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../../ListWrappers/ListHeading";
import SentRequestCard from "../RequestCards/SentRequestCard";

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
			{sentRequests.map((sentRequest) => {
				return (
					<SentRequestCard
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

export default SentFriendRequests;
