import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";
import FriendRequests from "@/app/components/Dashboard/FriendRequests/FriendRequests";
import Sidebar from "@/app/components/Dashboard/Sidebar/Sidebar";

export default function addFriendPage() {
	return (
		<>
			<Sidebar />
			<FriendRequests />
			<ChatScreen />
		</>
	);
}
