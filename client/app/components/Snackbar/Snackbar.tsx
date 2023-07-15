"use client";
import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { useUserStore } from "@/app/store/userStore";

import ExitIcon from "../Icons/ExitIcon";

function Snackbar() {
	// to-do -> implement visuals (html and css), snackbar methods, and a queue
	// snackbar methods: timer, close button, pause on tab and hover
	// props: message, snackbar type (error, success), and
	// state from zustand: snackbarQueue -> each queue item has a message and type
	const { snackbar, setSnackbar, currentSnackbar, setCurrentSnackbar } =
		useUserStore(
			(state) => ({
				snackbar: state.snackbar,
				setSnackbar: state.setSnackbar,
				currentSnackbar: state.currentSnackbar,
				setCurrentSnackbar: state.setCurrentSnackbar,
			}),
			shallow
		);
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(100);
	const errorClassName =
		"fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded bg-red-600 text-white py-4 shadow md:w-1/2";
	const successClassName =
		"fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded bg-green-600 text-white py-4 shadow md:w-1/2";
	const errorTimeBarClassName =
		"absolute bottom-0 h-1 rounded bg-rose-900 transition-all";
	const successTimeBarClassName =
		"absolute bottom-0 h-1 rounded bg-green-300 transition-all";
	console.log(snackbar, snackbar.isEmpty());
	console.log(currentSnackbar);

	const closeSnackbar = useCallback(() => {
		console.log("closing snackbar");
		setVisible(false);
		setTimeout(() => {
			setCurrentSnackbar({
				showSnackbar: false,
				message: null,
				type: "success",
			});
		}, 300);
	}, [setCurrentSnackbar]);

	useEffect(() => {
		// sets timer for snackbars
		if (currentSnackbar.showSnackbar) {
			console.log("setting timers");
			setVisible(true);
			setProgress(100);

			const timer = setInterval(() => {
				setProgress((prevProgress) => prevProgress - 1);
			}, 50);
			const timeout = setTimeout(() => {
				closeSnackbar();
				clearInterval(timer);
			}, 5000);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}
	}, [currentSnackbar.showSnackbar, closeSnackbar]);

	useEffect(() => {
		console.log(!snackbar.isEmpty(), currentSnackbar.showSnackbar);
		if (!snackbar.isEmpty() && currentSnackbar.showSnackbar == false) {
			const newSnackbar = snackbar.poll();
			//@ts-ignore
			setCurrentSnackbar(newSnackbar);
			setSnackbar(snackbar);
		}
	}, [currentSnackbar.showSnackbar, setCurrentSnackbar, setSnackbar, snackbar]);

	if (!currentSnackbar.showSnackbar) return <div></div>;

	return (
		<div
			className={`${
				currentSnackbar.type === "success" ? successClassName : errorClassName
			} transition-opacity duration-300 ${
				visible ? "opacity-100" : "opacity-0"
			}`}
		>
			<div className="flex justify-between px-4">
				<div>
					<span>{currentSnackbar.message}</span>
				</div>
				<span
					className="cursor-pointer hover:opacity-50"
					onClick={closeSnackbar}
				>
					<ExitIcon />
				</span>
			</div>
			<div
				className={
					currentSnackbar.type === "success"
						? successTimeBarClassName
						: errorTimeBarClassName
				}
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}

export default Snackbar;
