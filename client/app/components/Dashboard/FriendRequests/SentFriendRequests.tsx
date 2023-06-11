import ListHeading from "../ListHeading";
import SentRequestCard from "./RequestCards/SentRequestCard";
import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

function SentFriendRequests({ sentRequests }: SentFriendRequestsProps) {
	return (
		<>
			<ListHeading>Sent Requests</ListHeading>
			{sentRequests.map((sentRequest) => {
				<SentRequestCard
					userId={sentRequest.senderId}
					username={sentRequest.senderUsername}
					requestId={sentRequest._id}
					key={sentRequest._id}
				/>;
			})}
		</>
	);
}

export default SentFriendRequests;
