import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { ReceviedRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../../ListWrappers/ListHeading";
import RecievedRequestListItem from "../RequestListItem/ReceivedRequestListItem";

function ReceivedFriendRequests({ receivedRequests }: ReceviedRequestsProps) {
	const { users } = useUserStore(
		(state) => ({
			users: state.users,
		}),
		shallow
	);
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
				{receivedRequests?.map((receivedRequest) => {
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

export default ReceivedFriendRequests;
