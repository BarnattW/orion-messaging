import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";
import FriendList from "@/app/components/Dashboard/FriendList/FriendList";
import Sidebar from "@/app/components/Dashboard/Sidebar/Sidebar";

export default async function UserFriendsPage() {
	return (
		<>
			<Sidebar />
			<FriendList />
			<ChatScreen />
		</>
	);
}
