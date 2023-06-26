import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen";
import ConversationList from "@/app/components/Dashboard/ConversationList/ConversationList";
import Sidebar from "@/app/components/Dashboard/Sidebar/Sidebar";

export default async function userConversationsPage() {
	return (
		<>
			<Sidebar />
			<ConversationList />
			<ChatScreen />
		</>
	);
}
