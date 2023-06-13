import Avatar from "../../Avatar/Avatar";
import { RequestCardProps } from "@/app/types/FriendRequests";

function ReceivedRequestCard(friendRequestCardProps: RequestCardProps) {
	async function acceptRequest() {
		try {
			const response = await fetch(
				`/api/connect/acceptFriendRequest/:requestId`,
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
		//pending
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
		<div className="py-2 pl-1 hover:bg-zinc-700 hover:text-neutral-50 hover:cursor-pointer focus:bg-white max-w-full">
			<div className="flex mx-4 gap-2 items-center text-xs">
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
				<div className="flex gap-2 justify-end flex-shrink-0">
					<button
						className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 bg- text-md"
						onClick={acceptRequest}
					>
						Accept
					</button>
					<button
						className="px-2 py-1 rounded-md bg-pink-600 hover:bg-pink-500 bg- text-md"
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
