import Settings from "@/app/components/Dashboard/Settings/Settings";
import SettingsTab from "@/app/components/Dashboard/Settings/SettingsTab/SettingsTab";
import Sidebar from "@/app/components/Dashboard/Sidebar/Sidebar";

export default async function SettingsPage() {
	return (
		<>
			<Sidebar />
			<SettingsTab />
		</>
	);
}
