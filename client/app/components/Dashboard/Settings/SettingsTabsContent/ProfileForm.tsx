import { ChangeEvent, useRef, useState } from "react";

import { useUserStore } from "@/app/store/userStore";

import SettingsProfileCard from "./SettingsProfileCard";

const usernameCharacterLimit = 25;
const userStatusCharacterLimit = 100;

function ProfileForm() {
	const { username, setUsername, userId, setUsers } = useUserStore((state) => ({
		username: state.username,
		setUsername: state.setUsername,
		userId: state.userId,
		setUsers: state.setUsers,
	}));
	const [usernameValue, setUsernameValue] = useState(username);
	const [statusValue, setStatusValue] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);
	console.log(usernameValue, usernameValue === null);

	//@ts-ignore
	const handleCancel = (event) => {
		event.preventDefault();
		setUsernameValue(username);
		setStatusValue(null);
		if (inputFileRef.current) {
			inputFileRef.current.value = "";
		}
		setSelectedFile(null);
		setPreviewURL(null);
	};

	//@ts-ignore
	async function handleSave(event) {
		event?.preventDefault();
		// to-do: status and profile picture, also banner
		try {
			const response = await fetch("/api/connect/changeUsername", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, newUsername: usernameValue }),
			});

			// error handling
			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}
			setUsername(usernameValue);
			//@ts-ignore
			setUsers(userId, usernameValue);
		} catch (error) {
			console.log(error);
		}
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			if (file && file.type.startsWith("image/")) {
				setSelectedFile(file);
				setPreviewURL(URL.createObjectURL(file));
			} else {
				// Invalid file type
				setSelectedFile(null);
				setPreviewURL(null);
			}
		} else {
			// No file selected
			setSelectedFile(null);
			setPreviewURL(null);
		}
	};

	const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value.length <= usernameCharacterLimit) {
			setUsernameValue(value);
		}
	};

	const handleStatusInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		if (value.length <= userStatusCharacterLimit) {
			setStatusValue(value);
		}
	};

	return (
		<div className="flex flex-col gap-10 lg:flex-row">
			<form onSubmit={handleSave}>
				<label htmlFor="username" className="block">
					Username
				</label>
				<input
					id="username"
					className="mb-4 mt-1 w-64 rounded-sm bg-zinc-600 p-1 outline-none"
					value={usernameValue != null ? usernameValue : "null"}
					onChange={handleTitleInput}
				></input>
				<label htmlFor="userStatus" className="block">
					Status
				</label>
				<textarea
					id="userStatus"
					className="mb-4 mt-1 w-64 resize-none rounded-sm bg-zinc-600 p-1 outline-none scrollbar-thin scrollbar-thumb-zinc-700"
					rows={3}
					onChange={handleStatusInput}
				></textarea>
				<label htmlFor="avatar" className="block">
					Avatar
				</label>
				<input
					id="avatar"
					type="file"
					className="mb-4 mt-1 w-64 rounded-sm bg-zinc-600 p-1 outline-none"
					onChange={handleFileChange}
					ref={inputFileRef}
				></input>
				<div className="flex gap-4">
					<button
						className="w-20 rounded-md bg-indigo-700 px-2 py-1 text-center hover:bg-indigo-500"
						onClick={handleCancel}
					>
						Cancel
					</button>
					<button
						className="w-20 rounded-md bg-pink-600 px-2 py-1 text-center hover:bg-pink-500"
						type="submit"
					>
						Save
					</button>
				</div>
			</form>
			<div>
				<span>Preview</span>
				<div className="w-72 rounded-md border-2 border-zinc-600 drop-shadow-xl">
					<SettingsProfileCard
						imageUrl={previewURL ? previewURL : "/friend-icon-blue.png"}
						username={usernameValue != null ? usernameValue : "null"}
						userId={userId ? userId : "null"}
						status={statusValue}
					/>
				</div>
			</div>
		</div>
	);
}

export default ProfileForm;
