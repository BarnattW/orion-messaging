"use client";

import { useEffect, useState } from "react";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";

import HamburgerMenuIcon from "../../Icons/HamburgerMenuIcon";
import InviteFriends from "./InviteFriends";

const maxCharacters = 75;

function ChatTitle() {
	const { activeConversation, setShowUserList } = useUserStore((state) => ({
		activeConversation: state.activeConversation,
		setShowUserList: state.setShowUserList,
	}));
	const title = activeConversation?.title;
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	const [titleValue, setTitleValue] = useState("");

	useEffect(() => {
		//@ts-ignore
		setTitleValue(title);
	}, [title]);

	const toggleUserList = () => {
		setShowUserList();
	};

	// editing functions
	const toggleEditingMode = () => {
		setIsComponentVisible((prevBool) => {
			return !prevBool;
		});
	};

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value.length <= maxCharacters) {
			setTitleValue(value);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			editTitle();
			toggleEditingMode();
		}
		if (event.key === "Escape") {
			toggleEditingMode();
		}
	};

	const editTitle = async () => {
		try {
			console.log("edit title", titleValue);
			// to do
			const response = await fetch("/api/connect/renameGroup", {
				method: "POST",
				body: JSON.stringify({
					newName: titleValue,
					groupId: activeConversation?.groupId,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isComponentVisible && ref.current) {
			//@ts-ignore
			ref.current.focus();
		}
		if (!isComponentVisible) {
			//@ts-ignore
			setTitleValue(title);
		}
	}, [isComponentVisible, ref, title]);

	return (
		<div className="sticky top-0 flex justify-between border-b-2 border-neutral-600 bg-zinc-800 px-5 pb-4 pt-8 text-lg font-medium">
			{isComponentVisible ? (
				<input
					value={titleValue}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					ref={ref}
					className={`w-full grow resize-none rounded-sm bg-zinc-600 px-2 outline-none 
						`}
				></input>
			) : (
				<span onClick={toggleEditingMode} className="truncate">
					{title}
				</span>
			)}
			<div className="flex gap-4">
				{activeConversation?.groupId != undefined && <InviteFriends />}
				<div onClick={toggleUserList}>
					<HamburgerMenuIcon className="h-7 w-7 flex-shrink-0 fill-gray-100 hover:cursor-pointer" />
				</div>
			</div>
		</div>
	);
}

export default ChatTitle;
