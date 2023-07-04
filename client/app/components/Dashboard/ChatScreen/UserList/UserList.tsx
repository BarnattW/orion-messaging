import { useState } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";
import { SelectedFriend } from "@/app/types/FriendList";

import FriendCard from "../../FriendList/FriendListItem/FriendListItem";
import FriendContextMenu from "../../FriendList/FriendListItem/FriendContextMenu";
import UserListContainer from "./UserListContainer";
import UserListHeading from "./UserListHeading";

function UserList() {
	const { activeConversation } = useUserStore(
		(state) => ({
			activeConversation: state.activeConversation,
		}),
		shallow
	);
	const [selectedFriend, setSelectedFriend] = useState<SelectedFriend | null>(
		null
	);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const handleContextMenu = (
		event: React.MouseEvent<HTMLDivElement>,
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

	return (
		<UserListContainer>
			<UserListHeading>
				{activeConversation && <div>Users</div>}
			</UserListHeading>
			<div className="overflow-y-scroll scrollbar-thin">
				{activeConversation?.users.map((user) => {
					return (
						<FriendCard
							key={user.userId}
							altText={user.username}
							userId={user.userId}
							username={user.username}
							onlineStatus={true}
							handleContextMenu={handleContextMenu}
						/>
					);
				})}
			</div>
			{selectedFriend?.friendId && isComponentVisible && (
				<FriendContextMenu
					contextMenuPosition={contextMenuPosition}
					closeContextMenu={closeContextMenu}
					friendId={selectedFriend.friendId}
					friendUsername={selectedFriend.friendUsername}
					ref={ref}
				/>
			)}
		</UserListContainer>
	);
}

export default UserList;
