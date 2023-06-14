import Sidebar from "@/app/components/Dashboard/Sidebar";
import FriendList from "@/app/components/Dashboard/FriendList/FriendList";
import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";

export default async function UserFriendsPage({
	params,
}: {
	params: { slug: string };
}) {
	return (
		<>
			<Sidebar />
			<FriendList />
			<ChatScreen />
		</>
	);
}
