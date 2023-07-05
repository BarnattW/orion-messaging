import SettingsContainer from "../SettingsWrappers/SettingsContainer";
import SettingsHeading from "../SettingsWrappers/SettingsHeading";

const listItemClassNames =
	"rounded-lg mt-1 p-2 hover:bg-zinc-600 cursor-pointer";
const activeListItemClassNames =
	"rounded-lg p-2 bg-zinc-600 mt-1 hover:bg-zinc-600 cursor-pointer";
function SettingsTab() {
	return (
		<SettingsContainer>
			<SettingsHeading>Settings</SettingsHeading>
			<ul className="mx-5 gap-2 text-lg">
				<li className={listItemClassNames}>Profile</li>
				<li className={listItemClassNames}>Account</li>
				<li className={listItemClassNames}>Logout</li>
			</ul>
		</SettingsContainer>
	);
}

export default SettingsTab;
