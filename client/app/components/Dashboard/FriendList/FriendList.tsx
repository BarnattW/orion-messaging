import ListContainer from "../ListContainer";
import FriendCard from "./FriendCard";

interface Props {
	onlineFriends: string[];
	offlineFriends: string[];
}

function FriendList(friends: Props) {
	return (
		<ListContainer>
			<div className="text-lg px-5 bg-zinc-800  sticky top-0 pt-8 pb-1 backdrop-blur-lg z-10">
				Friends
			</div>
			<div>
				<p className="mx-5">{`Online - ${friends.onlineFriends.length} `}</p>
				{friends.onlineFriends.length > 0 &&
					friends.onlineFriends.map((onlineFriend) => {
						return (
							<FriendCard
								altText={onlineFriend}
								userId={onlineFriend}
								key={onlineFriend}
								onlineStatus="online"
							/>
						);
					})}
			</div>
			<div>
				<p className="mx-5">{`Offline - ${friends.offlineFriends.length}`}</p>
				{friends.offlineFriends.length > 0 &&
					friends.offlineFriends.map((offlineFriend) => {
						return (
							<FriendCard
								altText={offlineFriend}
								userId={offlineFriend}
								key={offlineFriend}
								onlineStatus="offline"
							/>
						);
					})}
			</div>
		</ListContainer>
	);
}

export default FriendList;
