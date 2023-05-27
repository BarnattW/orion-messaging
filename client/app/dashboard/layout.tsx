import Sidebar from "../components/Dashboard/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-gradient-to-r from-zinc-800 to-neutral-800 h-full min-h-full">
			<Sidebar />
			{children}
		</div>
	);
}
