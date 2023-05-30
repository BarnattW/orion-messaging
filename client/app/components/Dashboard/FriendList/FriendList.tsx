import FriendCard from "./FriendCard";

interface props {
	onlineFriends: string[];
	offlineFriends: string[];
}

function FriendList(friends: props) {
	return (
		<div className="h-full w-full sm:w-72 flex flex-col gap-6 border-r-2 border-neutral-700 overflow-auto text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:flex-shrink-0">
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
		</div>
	);
}

export default FriendList;
