"use client";
import { ChangeEvent, useRef, useState } from "react";

import { useUserStore } from "@/app/store/userStore";

import InviteFriendCard from "./InviteFriendCard";

function CreateGroupChat() {
	const { friends, userId, username } = useUserStore((state) => ({
		friends: state.friends,
		userId: state.userId,
		username: state.username,
	}));
	const title = useRef<HTMLInputElement>(null);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	console.log(selectedOptions);

	const createChat = async () => {
		console.log(title.current?.value, title.current?.value != " ");
		if (title.current && title.current?.value != " ") return;
		console.log("sending event");
		try {
			const response = await fetch("/api/connect/createGroup", {
				method: "POST",
				body: JSON.stringify({
					groupName: title,
					userId: userId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}
			const parsedResponse = await response.json();
			const groupId = parsedResponse.data._id;

			for (let i = 0; i < selectedOptions.length, i++; ) {
				try {
					const response = await fetch("/api/connect/sendGroupRequest", {
						method: "POST",
						body: JSON.stringify({
							groupId: groupId,
							senderUsername: username,
							receiverUsername: selectedOptions[i],
						}),
					});

					if (!response.ok) {
						console.log(response);
					}
				} catch (error) {
					console.log(error);
				}
			}
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

	return (
		<div className="absolute top-full z-50 flex w-72 flex-col gap-2 rounded-md bg-zinc-700 py-4 text-base text-gray-200 scrollbar-thumb-neutral-800">
			<div className="flex flex-col gap-2 px-3">
				<p>Creating Group Chat</p>
				<input
					placeholder="Group Chat Name"
					className="bg-zinc-800 p-1 outline-none"
					ref={title}
				></input>

				<div className="sticky top-0">Invite Friends</div>
			</div>
			<div className="max-h-40 overflow-scroll px-3 scrollbar-thin">
				{friends.length === 0 && (
					<p className="flex justify-center">No friends found.</p>
				)}
				{friends.map((friend) => (
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
							id={friend.username}
							checked={selectedOptions.includes(`${friend.username}`)}
							onChange={handleCheckboxChange}
						></input>
					</label>
				))}
			</div>
			<button
				className="mx-3 rounded-md bg-indigo-600 py-1 hover:bg-indigo-500"
				onClick={createChat}
			>
				Create Chat
			</button>
		</div>
	);
}

export default CreateGroupChat;
