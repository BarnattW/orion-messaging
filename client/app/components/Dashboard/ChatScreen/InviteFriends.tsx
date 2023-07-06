"use client";
import { ChangeEvent, useRef, useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";

import FriendAddIcon from "../../Icons/FriendAddIcon";
import InviteFriendCard from "../ConversationList/InviteFriendCard";

const iconClassNames =
	"fill-gray-100 h-6 w-6 hover:cursor-pointer flex-shrink-0";

function InviteFriends() {
	const { friends, userId, username, activeConversation } = useUserStore(
		(state) => ({
			friends: state.friends,
			userId: state.userId,
			username: state.username,
			activeConversation: state.activeConversation,
		})
	);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [friendsQuery, setFriendsQuery] = useState<string>("");
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const inviteFriends = async () => {
		try {
			for (let i = 0; i < selectedOptions.length; i++) {
				const sendInviteResponse = await fetch(
					"/api/connect/sendGroupRequest",
					{
						method: "POST",
						body: JSON.stringify({
							groupId: activeConversation?.groupId,
							senderUsername: username,
							receiverUsername: selectedOptions[i],
						}),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				console.log(sendInviteResponse);
				if (!sendInviteResponse) {
					console.log(sendInviteResponse);
				}
			}
			setIsComponentVisible(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const optionId = event.target.id;
		if (event.target.checked) {
			setSelectedOptions([...selectedOptions, optionId]);
		} else {
			setSelectedOptions(
				selectedOptions.filter((option) => option !== optionId)
			);
		}
	};

	const filterFriends = (event: ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setFriendsQuery(query);
	};

	const toggleInviteFriends = () => {
		setIsComponentVisible((prevBool) => !prevBool);
	};

	return (
		<div ref={ref} className="relative">
			<div onClick={toggleInviteFriends}>
				<FriendAddIcon className={iconClassNames} />
			</div>

			{isComponentVisible && (
				<div className="absolute right-0 top-full z-50 flex w-72 flex-col gap-2 rounded-md bg-zinc-700 py-4 text-base text-gray-200 scrollbar-thumb-neutral-800">
					<div className="flex flex-col gap-2 px-3">
						<div className="sticky top-0">Invite Friends</div>
						<input
							type="text"
							placeholder="Search by username"
							className="rounded-md bg-zinc-800 p-1 outline-none"
							onChange={filterFriends}
						></input>
					</div>
					<div className="max-h-40 overflow-scroll px-3 scrollbar-thin">
						{friends.length === 0 && (
							<p className="flex justify-center">No friends found.</p>
						)}
						{friends
							.filter(
								(friend) =>
									friend.username
										.toLowerCase()
										.includes(friendsQuery.toLowerCase()) &&
									!activeConversation?.users.some(
										(user) => user.username === friend.username
									)
							)
							.map((friend) => (
								<label
									htmlFor={friend.userId}
									className="flex items-center justify-between hover:cursor-pointer"
									key={friend.userId}
								>
									<InviteFriendCard
										altText={friend.username}
										username={friend.username}
										onlineStatus={true}
										userId={friend.userId}
									/>
									<input
										className="h-4 w-4 bg-zinc-600"
										type="checkbox"
										id={friend.userId}
										checked={selectedOptions.includes(`${friend.username}`)}
										onChange={handleCheckboxChange}
									></input>
								</label>
							))}
					</div>
					<button
						className="mx-3 rounded-md bg-indigo-600 py-1 hover:bg-indigo-500"
						onClick={inviteFriends}
					>
						Invite
					</button>
				</div>
			)}
		</div>
	);
}

export default InviteFriends;