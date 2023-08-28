import ConfirmationDialogBox from "@/app/components/Dialog/ConfirmationDialogBox";
import DialogWrapper from "@/app/components/Dialog/DialogWrapper";
import LogoutIcon from "@/app/components/Icons/LogoutIcon";
import { useUserStore } from "@/app/store/userStore";

const iconClassNames =
	"fill-gray-100 h-6 w-6 hover:cursor-pointer hover:fill-gray-400 stroke-neutral-100 hover:stroke-gray-400";

function LeaveGroup() {
	const { userId, activeConversation, enqueueSnackbar } = useUserStore(
		(state) => ({
			userId: state.userId,
			activeConversation: state.activeConversation,
			enqueueSnackbar: state.enqueueSnackbar,
		})
	);

	async function leaveGroup() {
		try {
			let newSnackbar;
			const response = await fetch("/api/connect/leaveGroup", {
				method: "PUT",
				body: JSON.stringify({
					groupId: activeConversation?.groupId,
					userId: userId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				newSnackbar = {
					type: "error",
					message: "Failed to Leave Group",
					showSnackbar: true,
				};
			} else {
				newSnackbar = {
					type: "success",
					message: "Successfully Left Group",
					showSnackbar: true,
				};
			}
			enqueueSnackbar(newSnackbar);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			<DialogWrapper
				content={
					<ConfirmationDialogBox
						heading="Leave Group?"
						message="Once you leave this group, you cannot rejoin unless reinvited."
						cancelText="Cancel"
						confirmText="Leave"
						onConfirm={leaveGroup}
					/>
				}
				trigger={<LogoutIcon className={iconClassNames} />}
			/>
		</>
	);
}

export default LeaveGroup;
