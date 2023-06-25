import { RequestCardProps } from "@/app/types/FriendRequests";

import Avatar from "../../Avatar/Avatar";

function ReceivedRequestCard(friendRequestCardProps: RequestCardProps) {
	async function acceptRequest() {
		try {
			const response = await fetch(
				`/api/connect/acceptFriendRequest/${friendRequestCardProps.requestId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteRequest() {
		try {
			const response = await fetch(
				`/api/connect/rejectFriendRequest/${friendRequestCardProps.requestId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="max-w-full py-2 pl-1 hover:cursor-pointer hover:bg-zinc-700 hover:text-neutral-50 focus:bg-white">
			<div className="mx-4 flex items-center gap-2 text-xs">
				<div className="relative z-0">
					<Avatar
						imageUrl="/friend-icon.svg"
						altText={friendRequestCardProps.username}
						username={friendRequestCardProps.username}
						type="default"
					/>
				</div>
				<div className="flex-1 overflow-hidden">
					<div className="truncate">{friendRequestCardProps.username}</div>
				</div>
				<div className="flex flex-shrink-0 justify-end gap-2">
					<button
						className="bg- text-md rounded-md bg-indigo-600 px-2 py-1 hover:bg-indigo-500"
						onClick={acceptRequest}
					>
						Accept
					</button>
					<button
						className="bg- text-md rounded-md bg-pink-600 px-2 py-1 hover:bg-pink-500"
						onClick={deleteRequest}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default ReceivedRequestCard;
