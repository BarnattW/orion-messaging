import AddFriend from "@/app/components/Dashboard/AddFriend/AddFriend";
import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";
import Sidebar from "@/app/components/Dashboard/Sidebar";

export default function addFriendPage({
	params,
}: {
	params: { slug: string };
}) {
	return (
		<>
			<Sidebar userId={params.slug} />
			<AddFriend />
			<ChatScreen />
		</>
	);
}
