import ListHeading from "../ListHeading";
import RequestCard from "./RequestCard";
import { receviedRequestsProps } from "@/app/types/FriendRequests";

function ReceivedFriendRequests({ receivedRequests }: receviedRequestsProps) {
	return <ListHeading>Friend Requests</ListHeading>;
}

export default ReceivedFriendRequests;
