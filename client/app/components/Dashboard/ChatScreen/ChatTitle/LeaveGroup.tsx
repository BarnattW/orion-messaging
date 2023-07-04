import { useRef } from "react";

import LogoutIcon from "@/app/components/Icons/LogoutIcon";

import ConfirmationDialogBox from "./ConfirmationDialogBox";
import classes from "./LeaveGroup.module.css";

const iconClassNames =
	"fill-gray-100 h-6 w-6 hover:cursor-pointer hover:fill-gray-400 stroke-neutral-100 hover:stroke-gray-400";

function LeaveGroup() {
	const leaveConfirmationRef = useRef<HTMLDialogElement>(null);

	function showProfile() {
		if (leaveConfirmationRef.current) {
			leaveConfirmationRef.current.showModal();
		}
	}

	function closeProfile(event: React.MouseEvent<HTMLDialogElement>) {
		if (
			event.target === leaveConfirmationRef.current &&
			leaveConfirmationRef.current
		) {
			leaveConfirmationRef.current.close();
		}
	}
	return (
		<>
			<dialog
				ref={leaveConfirmationRef}
				className={`${classes.LeaveGroup} w-max rounded-md bg-zinc-800 p-0 outline-none sm:w-72`}
				onClick={closeProfile}
			>
				<ConfirmationDialogBox ref={leaveConfirmationRef} />
			</dialog>
			<button onClick={showProfile}>
				<LogoutIcon className={iconClassNames} />
			</button>
		</>
	);
}

export default LeaveGroup;
