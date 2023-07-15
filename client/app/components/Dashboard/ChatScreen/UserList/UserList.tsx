import { useState } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";
import { SelectedFriend } from "@/app/types/FriendList";

import FriendContextMenu from "../../FriendList/FriendListItem/FriendContextMenu";
import FriendListItem from "../../FriendList/FriendListItem/FriendListItem";
import UserListContainer from "./UserListContainer";
import UserListHeading from "./UserListHeading";

function UserList() {
	const { activeConversation, userId, users, showUserList } = useUserStore(
		(state) => ({
			activeConversation: state.activeConversation,
			userId: state.userId,
			users: state.users,
			showUserList: state.showUserList,
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

	if (!showUserList) {
		return null;
	}

	return (
		<UserListContainer>
			<UserListHeading>
				{activeConversation && <div>Users</div>}
			</UserListHeading>
			<ul className="overflow-y-scroll scrollbar-thin">
				{activeConversation?.users.map((user) => {
					return (
						<FriendListItem
							key={user.userId}
							altText={users[user.userId].username}
							userId={user.userId}
							//@ts-ignore
							username={users[user.userId].username}
							onlineStatus={true}
							handleContextMenu={handleContextMenu}
						/>
					);
				})}
			</ul>
			{selectedFriend?.friendId &&
				selectedFriend?.friendId != userId &&
				isComponentVisible && (
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
