import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";
import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

import ListHeading from "../../ListWrappers/ListHeading";
import SentRequestListItem from "../RequestListItem/SentRequestListItem";

function SentFriendRequests({ sentRequests }: SentFriendRequestsProps) {
	const { users } = useUserStore((state) => ({ users: state.users }), shallow);
	console.log("users", users);
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
					if (!users[sentRequest.receiverId]) return;

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

export default SentFriendRequests;
