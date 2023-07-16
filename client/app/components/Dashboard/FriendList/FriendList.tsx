"use client";
import { ChangeEvent, useState } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";
import { SelectedFriend } from "@/app/types/FriendList";

import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import FriendContextMenu from "./FriendListItem/FriendContextMenu";
import FriendListItem from "./FriendListItem/FriendListItem";

function FriendList() {
	const { friends, users, enqueueSnackbar } = useUserStore(
		(state) => ({
			friends: state.friends,
			users: state.users,
			enqueueSnackbar: state.enqueueSnackbar,
		}),
		shallow
	);
	const [friendsQuery, setFriendsQuery] = useState<string>("");
	const [selectedFriend, setSelectedFriend] = useState<SelectedFriend | null>(
		null
	);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const filterFriends = (event: ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setFriendsQuery(query);
	};

	const handleContextMenu = (
		event: React.MouseEvent<HTMLLIElement>,
		friendInfo: SelectedFriend
	) => {
		event.preventDefault();
		setSelectedFriend(friendInfo);
		setContextMenuPosition({ x: event.clientX, y: event.clientY });
		setIsComponentVisible(true);
	};

	const closeContextMenu = () => {
		setSelectedFriend(null);
	};

	const addSnackbar = () => {
		const newSnackbar = {
			showSnackbar: true,
			message: "test",
			type: "success",
		};

		enqueueSnackbar(newSnackbar);
	};

	return (
		<ListContainer>
			<ListHeading>Friends</ListHeading>
			<input
				type="text"
				placeholder="Search by username"
				className="mx-5 rounded-md bg-zinc-900 p-1 outline-none"
				onChange={filterFriends}
			></input>
			<ul className="overflow-y-scroll scrollbar-thin">
				<p className="mx-5">{`Online - ${friends.length} `}</p>
				{friends.length > 0 &&
					friends
						.filter((friend) =>
							users[friend.userId].username
								.toLowerCase()
								.includes(friendsQuery.toLowerCase())
						)
						.map((friend) => {
							return (
								<FriendListItem
									altText={users[friend.userId].username}
									username={users[friend.userId].username}
									userId={friend.userId}
									key={friend.userId}
									onlineStatus={true}
									handleContextMenu={handleContextMenu}
								/>
							);
						})}
			</ul>
			{selectedFriend?.friendId && isComponentVisible && (
				<FriendContextMenu
					contextMenuPosition={contextMenuPosition}
					closeContextMenu={closeContextMenu}
					friendId={selectedFriend.friendId}
					friendUsername={selectedFriend.friendUsername}
					ref={ref}
				/>
			)}
			<button onClick={addSnackbar}>Hi</button>
		</ListContainer>
	);
}

export default FriendList;
