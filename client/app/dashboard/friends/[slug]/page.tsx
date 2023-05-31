import Sidebar from "@/app/components/Dashboard/Sidebar";
import FriendList from "@/app/components/Dashboard/FriendList/FriendList";
import { dummyFriends } from "@/app/dummy-data/dummy-friends";
import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";

interface Friends {
	online: string[];
	offline: string[];
}

async function getFriends(): Promise<Friends> {
	//dummyData
	const friends: Friends = dummyFriends;
	return friends;
}

export default async function UserFriendsPage({
	params,
}: {
	params: { slug: string };
}) {
	const friends: Friends = await getFriends();

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
