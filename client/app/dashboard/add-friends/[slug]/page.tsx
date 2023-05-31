import Sidebar from "@/app/components/Dashboard/Sidebar";

export default function addFriendPage({
	params,
}: {
	params: { slug: string };
}) {
	return (
		<>
			<Sidebar userId={params.slug} />
		</>
	);
}
