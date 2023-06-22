"use client";
import { useUserStore } from "@/app/store/userStore";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import FriendCard from "./FriendCard";

function FriendList() {
	const { friends } = useUserStore((state) => ({ friends: state.friends }));

	return (
		<ListContainer>
			<ListHeading>Friends</ListHeading>
			<div>
				<p className="mx-5">{`Online - ${friends.length} `}</p>
				{friends.length > 0 &&
					friends.map((friend) => {
						return (
							<FriendCard
								altText={friend.username}
								username={friend.username}
								userId={friend.userId}
								key={friend.userId}
								onlineStatus={true}
							/>
						);
					})}
			</div>
			{/* <div>
				<p className="mx-5">{`Online - ${friends.onlineFriends.length} `}</p>
				{friends.onlineFriends.length > 0 &&
					friends.onlineFriends.map((onlineFriend) => {
						return (
							<FriendCard
								altText={onlineFriend}
								userId={onlineFriend}
								key={onlineFriend}
								onlineStatus={true}
							/>
						);
					})}
			</div> */}
			{/* <div>
				<p className="mx-5">{`Offline - ${friends.offlineFriends.length}`}</p>
				{friends.offlineFriends.length > 0 &&
					friends.offlineFriends.map((offlineFriend) => {
						return (
							<FriendCard
								altText={offlineFriend}
								userId={offlineFriend}
								key={offlineFriend}
								onlineStatus={false}
							/>
						);
					})}
			</div> */}
		</ListContainer>
	);
}

export default FriendList;
