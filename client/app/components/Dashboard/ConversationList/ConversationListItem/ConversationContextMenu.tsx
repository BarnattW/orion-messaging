import { ForwardedRef, forwardRef } from "react";
import { shallow } from "zustand/shallow";

import ConfirmationDialogBox from "@/app/components/Dialog/ConfirmationDialogBox";
import DialogWrapper from "@/app/components/Dialog/DialogWrapper";
import { useUserStore } from "@/app/store/userStore";
import { ConversationContextMenuProps } from "@/app/types/Conversations";

const ConversationContextMenu = forwardRef(function (
	{
		contextMenuPosition,
		closeContextMenu,
		selectedConversation,
	}: ConversationContextMenuProps,
	ref: ForwardedRef<HTMLDivElement>
) {
	const { userId, enqueueSnackbar } = useUserStore(
		(state) => ({
			userId: state.userId,
			enqueueSnackbar: state.enqueueSnackbar,
		}),
		shallow
	);

	async function leaveGroup() {
		try {
			let newSnackbar;
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
			closeContextMenu();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div
			style={{
				top: contextMenuPosition.y,
				left: contextMenuPosition.x,
			}}
			className="fixed w-32 rounded-md bg-neutral-900 py-2 text-sm text-gray-50 scrollbar-thumb-neutral-800"
			ref={ref}
		>
			<ul>
				{selectedConversation.type === "group" && (
					<DialogWrapper
						content={
							<ConfirmationDialogBox
								heading={`Leave ${selectedConversation.conversationName}?`}
								message="Once you leave this group, you cannot rejoin unless reinvited."
								cancelText="Cancel"
								confirmText="Leave"
								onCancel={closeContextMenu}
								onConfirm={leaveGroup}
							/>
						}
						trigger={
							<li className="rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-pink-600">
								Leave Group
							</li>
						}
					/>
				)}
			</ul>
		</div>
	);
});

ConversationContextMenu.displayName = "ConversationContextMenu";

export default ConversationContextMenu;
