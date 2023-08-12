import { useUserStore } from "@/app/store/userStore";
import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

import SentRequestListItem from "../FriendRequests/RequestListItem/SentRequestListItem";
import ListHeading from "../ListWrappers/ListHeading";

function SentGroupRequests({ sentRequests }: SentFriendRequestsProps) {
	const users = useUserStore((state) => state.users);

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
							username={users[sentRequest.receiverId].username}
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

export default SentGroupRequests;
