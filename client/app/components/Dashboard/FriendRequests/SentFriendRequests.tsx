import ListHeading from "../ListHeading";
import RequestCard from "./RequestCard";
import { SentFriendRequestsProps } from "@/app/types/FriendRequests";

function SentFriendRequests({ sentRequests }: SentFriendRequestsProps) {
	return (
		<>
			<ListHeading>Sent Requests</ListHeading>
			{sentRequests.map}
		</>
	);
}

export default SentFriendRequests;
