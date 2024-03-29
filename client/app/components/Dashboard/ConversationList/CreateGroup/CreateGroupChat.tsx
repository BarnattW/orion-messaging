"use client";
import { ChangeEvent, useRef, useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";

import AddIcon from "../../../Icons/AddIcon";
import InviteFriendCard from "./InviteFriendListItem";

const iconClassNames: string =
	"h-7 w-7 hover:cursor-pointer stroke-gray-100 hover:stroke-gray-400";
const maxTitleCharacterLimit = 75;

function CreateGroupChat() {
	const { friends, userId, username, users, enqueueSnackbar } = useUserStore(
		(state) => ({
			friends: state.friends,
			userId: state.userId,
			username: state.username,
			users: state.users,
			enqueueSnackbar: state.enqueueSnackbar,
		}),
	);
	const title = useRef<HTMLInputElement>(null);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [friendsQuery, setFriendsQuery] = useState<string>("");
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);

	const toggleCreateGroup = () => {
		setIsComponentVisible((prevBool) => !prevBool);
	};

	const createChat = async () => {
		if (title.current && title.current?.value.trim() === "") return;
		try {
			let newSnackbar;
			const response = await fetch("/api/connect/createGroup", {
				method: "POST",
				body: JSON.stringify({
					groupName: title.current?.value.trim(),
					userId: userId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				newSnackbar = {
					type: "error",
					message: "Failed to Create Group",
					showSnackbar: true,
				};
			} else {
				newSnackbar = {
					type: "success",
					message: "Successfully Created Group",
					showSnackbar: true,
				};
			}
			enqueueSnackbar(newSnackbar);

			const parsedResponse = await response.json();
			const groupId = parsedResponse.data._id;

			setIsComponentVisible(false);

			for (let i = 0; i < selectedOptions.length; i++) {
				const sendInviteResponse = await fetch(
					"/api/connect/sendGroupRequest",
					{
						method: "POST",
						body: JSON.stringify({
							groupId: groupId,
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
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const optionId = event.target.dataset.username;
		if (event.target.checked && optionId) {
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

	return (
		<div className="relative" ref={ref}>
			<div onClick={toggleCreateGroup}>
				<AddIcon className={iconClassNames} />
			</div>
			{isComponentVisible && (
				<div className="absolute top-full flex w-72 flex-col gap-2 rounded-md bg-zinc-700 py-4 text-base text-gray-200 scrollbar-thumb-neutral-800">
					<div className="flex flex-col gap-2 px-3">
						<p>Creating Group Chat</p>
						<input
							placeholder="Group Chat Name"
							className="rounded-md bg-zinc-800 p-1 outline-none"
							ref={title}
							maxLength={maxTitleCharacterLimit}
						></input>

						<div className="sticky top-0">Invite Friends</div>
						<input
							type="text"
							placeholder="Search by username"
							className="rounded-md bg-zinc-800 p-1 outline-none"
							onChange={filterFriends}
						></input>
					</div>
					<ul className="max-h-40 overflow-scroll px-3 scrollbar-thin">
						{friends.length === 0 && (
							<p className="flex justify-center">No friends found.</p>
						)}
						{friends
							.filter((friend) =>
								users[friend.userId].username
									.toLowerCase()
									.includes(friendsQuery.toLowerCase())
							)
							.map((friend) => (
								<label
									htmlFor={friend.userId}
									className="flex items-center justify-between hover:cursor-pointer"
									key={friend.userId}
								>
									<InviteFriendCard
										altText={users[friend.userId].username}
										username={users[friend.userId].username}
										onlineStatus={true}
										userId={friend.userId}
									/>
									<input
										className="h-4 w-4 bg-zinc-600"
										type="checkbox"
										id={friend.userId}
										data-username={users[friend.userId].username}
										checked={selectedOptions.includes(
											users[friend.userId].username
										)}
										onChange={handleCheckboxChange}
									></input>
								</label>
							))}
					</ul>
					<button
						className="mx-3 rounded-md bg-indigo-600 py-1 hover:bg-indigo-500"
						onClick={createChat}
					>
						Create Chat
					</button>
				</div>
			)}
		</div>
	);
}

export default CreateGroupChat;
