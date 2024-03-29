"use client";
import { useCallback, useEffect, useState } from "react";

import { useUserStore } from "@/app/store/userStore";

import ErrorIcon from "../Icons/ErrorIcon";
import ExitIcon from "../Icons/ExitIcon";
import SuccessIcon from "../Icons/SuccessIcon";

const errorClassName =
	"fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded bg-red-600 text-white py-4 shadow md:w-1/2";
const successClassName =
	"fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded bg-green-600 text-white py-4 shadow md:w-1/2";
const errorTimeBarClassName =
	"absolute bottom-0 h-1 rounded bg-rose-950 transition-all";
const successTimeBarClassName =
	"absolute bottom-0 h-1 rounded bg-green-300 transition-all";

function Snackbar() {
	// snackbar methods: pause on tab and hover
	const { snackbar, setSnackbar, currentSnackbar, setCurrentSnackbar } =
		useUserStore((state) => ({
			snackbar: state.snackbar,
			setSnackbar: state.setSnackbar,
			currentSnackbar: state.currentSnackbar,
			setCurrentSnackbar: state.setCurrentSnackbar,
		}));
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(100);

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
				<div className="flex items-center justify-normal gap-2">
					<span>
						{currentSnackbar.type === "success" ? (
							<SuccessIcon className="h-7 w-7 fill-gray-100" />
						) : (
							<ErrorIcon className="h-7 w-7 fill-gray-100" />
						)}
					</span>
					<span className="text-lg">{currentSnackbar.message}</span>
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
