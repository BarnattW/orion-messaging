import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";
import ConversationList from "@/app/components/Dashboard/ConversationList/ConversationList";
import Sidebar from "@/app/components/Dashboard/Sidebar";

export default async function userConversationsPage({
	params,
}: {
	params: { slug: string };
}) {
	return (
		<>
			<Sidebar />
			<ConversationList />
			<ChatScreen />
		</>
	);
}
