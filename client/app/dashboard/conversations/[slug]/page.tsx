import Sidebar from "@/app/components/Dashboard/Sidebar";

export default function userConversationsPage({
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
