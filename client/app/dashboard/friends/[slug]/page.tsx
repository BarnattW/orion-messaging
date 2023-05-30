import Sidebar from "@/app/components/Dashboard/Sidebar";
import FriendList from "@/app/components/Dashboard/FriendList/FriendList";
import { dummyFriends } from "@/app/dummy-data/dummy-friends";
import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";

interface friends {
	online: string[];
	offline: string[];
}

async function getFriends() {
	//dummyData
	const friends: friends = dummyFriends;
	return friends;
}

export default async function UserFriendsPage({
	params,
}: {
	params: { slug: string };
}) {
	const friends = await getFriends();

	return (
		<>
			<Sidebar userId={params.slug} />
			<FriendList
				onlineFriends={friends.online}
				offlineFriends={friends.offline}
			/>
			<ChatScreen />
		</>
	);
}
