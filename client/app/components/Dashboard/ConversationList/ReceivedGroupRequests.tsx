import { useUserStore } from "@/app/store/userStore";
import { ReceviedRequestsProps } from "@/app/types/FriendRequests";

import RecievedRequestListItem from "../FriendRequests/RequestListItem/ReceivedRequestListItem";
import ListHeading from "../ListWrappers/ListHeading";

function ReceivedGroupRequests({ receivedRequests }: ReceviedRequestsProps) {
	const users = useUserStore((state) => state.users);
	console.log(users);

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
			<ul>
				{receivedRequests?.map((receivedRequest) => {
					if (!users[receivedRequest.senderId]) return;
					return (
						<RecievedRequestListItem
							userId={receivedRequest.senderId}
							username={users[receivedRequest.senderId].username}
							requestId={receivedRequest._id}
							key={receivedRequest._id}
							requestType={receivedRequest.requestType}
						/>
					);
				})}
			</ul>
		</>
	);
}

export default ReceivedGroupRequests;
