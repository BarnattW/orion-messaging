"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ProfileForm from "../SettingsTabs/ProfileForm";
import TabHeading from "../SettingsTabs/TabHeading";
import SettingsContainer from "../SettingsWrappers/SettingsContainer";
import SettingsHeading from "../SettingsWrappers/SettingsHeading";

const listItemClassNames =
	"rounded-lg mt-1 p-2 hover:bg-zinc-600 cursor-pointer";
const activeListItemClassNames =
	"rounded-lg p-2 bg-zinc-600 mt-1 hover:bg-zinc-600 cursor-pointer";
function SettingsTab() {
	const [toggleState, setToggleState] = useState(1);

	const toggleTab = (index: number) => {
		setToggleState(index);
	};
	const router = useRouter();

	async function logout() {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: null,
			});

			// error handling
			if (!response.ok) {
				// update with common error handling
				console.log(response);
			}

			router.push("/auth/login");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<SettingsContainer>
				<SettingsHeading>Settings</SettingsHeading>
				<ul className="mx-5 gap-2 text-base">
					<li
						className={
							toggleState === 1 ? activeListItemClassNames : listItemClassNames
						}
						onClick={() => toggleTab(1)}
					>
						Profile
					</li>
					<li
						className={
							toggleState === 2 ? activeListItemClassNames : listItemClassNames
						}
						onClick={() => toggleTab(2)}
					>
						Notifications
					</li>
					<li
						className={
							toggleState === 3 ? activeListItemClassNames : listItemClassNames
						}
						onClick={() => toggleTab(3)}
					>
						Account
					</li>
					<li
						className={
							toggleState === 4 ? activeListItemClassNames : listItemClassNames
						}
						onClick={() => {
							toggleTab(4);
							logout();
						}}
					>
						Logout
					</li>
				</ul>
			</SettingsContainer>
			<div className="ml-2 flex h-full grow flex-col items-center overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 sm:ml-10 sm:items-baseline">
				{toggleState === 1 && (
					<>
						<TabHeading content="Profile" />
						<ProfileForm />
					</>
				)}
				{toggleState === 2 && <TabHeading content="Notifications" />}
				{toggleState === 3 && <TabHeading content="Account" />}
			</div>
		</>
	);
}

export default SettingsTab;
