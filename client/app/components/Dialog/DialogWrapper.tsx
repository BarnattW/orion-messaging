import { ReactNode, useRef } from "react";
import React from "react";

import classes from "./DialogWrapper.module.css";

const iconClassNames =
	"fill-gray-100 h-6 w-6 hover:cursor-pointer hover:fill-gray-400 stroke-neutral-100 hover:stroke-gray-400";

function DialogWrapper({
	content,
	trigger,
}: {
	content: ReactNode;
	trigger: ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	function showProfile() {
		if (dialogRef.current) {
			dialogRef.current.showModal();
		}
	}

	function closeProfile(event: React.MouseEvent<HTMLDialogElement>) {
		if (event.target === dialogRef.current && dialogRef.current) {
			dialogRef.current.close();
		}
	}
	return (
		<>
			<dialog
				ref={dialogRef}
				className={`${classes.DialogWrapper} w-max rounded-md bg-zinc-800 p-0 outline-none sm:w-72`}
				onClick={closeProfile}
			>
				{React.cloneElement(content as React.ReactElement, { ref: dialogRef })}
			</dialog>
			<span onClick={showProfile}>{trigger}</span>
		</>
	);
}

export default DialogWrapper;
