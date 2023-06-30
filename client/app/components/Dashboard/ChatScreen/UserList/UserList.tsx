import { useUserStore } from "@/app/store/userStore";

import FriendCard from "../../FriendList/FriendCard";
import UserListContainer from "./UserListContainer";
import UserListHeading from "./UserListHeading";

function UserList() {
	const { activeConversation } = useUserStore((state) => ({
		activeConversation: state.activeConversation,
	}));

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
						/>
					);
				})}
			</div>
		</UserListContainer>
	);
}

export default UserList;
