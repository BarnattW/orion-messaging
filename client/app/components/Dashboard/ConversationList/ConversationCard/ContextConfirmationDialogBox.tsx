import { ForwardedRef, forwardRef } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";

const ContextConfirmationDialogBox = forwardRef(function (
	{ closeContextMenu, selectedConversation },
	ref: ForwardedRef<HTMLDialogElement>
) {
	const { userId } = useUserStore(
		(state) => ({
			userId: state.userId,
		}),
		shallow
	);
	function closeProfile() {
		if (ref && "current" in ref && ref.current) {
			ref.current.close();
		}
	}

	async function leaveGroup() {
		try {
			const response = await fetch("/api/connect/leaveGroup", {
				method: "PUT",
				body: JSON.stringify({
					groupId: selectedConversation.groupId,
					userId: userId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// update with common error handling
				console.log(response);
			} else {
				// update ui
				console.log(response);
			}
			closeProfile();
			closeContextMenu();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="flex flex-col gap-4 p-4 text-base text-gray-100">
			<div>Leave Group?</div>
			<div className="text-sm">
				Once you leave this group, you cannot rejoin unless reinvited.
			</div>
			<div className="flex justify-end gap-6">
				<button
					className="rounded-md bg-indigo-700 px-2 py-1 hover:bg-indigo-500"
					onClick={closeProfile}
				>
					Cancel
				</button>
				<button
					className="rounded-md bg-red-700 px-2 py-1 hover:bg-red-500"
					onClick={leaveGroup}
				>
					Leave
				</button>
			</div>
		</div>
	);
});

ContextConfirmationDialogBox.displayName = "ConfirmationDialogBox";
export default ContextConfirmationDialogBox;
