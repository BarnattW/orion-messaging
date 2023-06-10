import ChatScreen from "@/app/components/Dashboard/ChatScreen/ChatScreen/ChatScreen";
import ConversationList from "@/app/components/Dashboard/ConversationList/ConversationList";
import Sidebar from "@/app/components/Dashboard/Sidebar";
import { dummyConversations } from "@/app/dummy-data/dummy-conversations";

interface Conversation {
	conversationId: number;
	users: string[];
	conversationImageUrl: string;
	conversationName: string;
	type: string;
}

async function getConversations() {
	//dummyData
	const conversations: Conversation[] = dummyConversations.conversations;
	return conversations;
}

export default async function userConversationsPage({
	params,
}: {
	params: { slug: string };
}) {
	const conversations = await getConversations();

	return (
		<>
			<Sidebar />
			<ConversationList conversations={conversations} />
			<ChatScreen />
		</>
	);
}
