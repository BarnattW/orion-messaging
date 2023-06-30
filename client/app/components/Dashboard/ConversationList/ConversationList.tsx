"use client";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";

import AddIcon from "../../Icons/AddIcon";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";
import CreateGroupChat from "./CreateGroupChat";

const iconClassNames: string = "fill-gray-100 h-7 w-7 hover:cursor-pointer";

function ConversationList() {
	const { conversations } = useUserStore(
		(state) => ({
			conversations: state.conversations,
		}),
		shallow
	);
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	console.log(conversations);

	const toggleCreateGroup = () => {
		setIsComponentVisible((prevBool) => !prevBool);
	};

	return (
		<ListContainer>
			<ListHeading>
				<div className="flex justify-between">
					Messages
					<div className="relative" ref={ref}>
						<div onClick={toggleCreateGroup}>
							<AddIcon className={iconClassNames} />
						</div>
						{isComponentVisible && (
							<CreateGroupChat setIsComponentVisible={setIsComponentVisible} />
						)}
					</div>
				</div>
			</ListHeading>
			<div className="overflow-y-scroll scrollbar-thin">
				{conversations.length > 0 &&
					conversations.map((conversation) => {
						return (
							<ConversationCard
								altText={conversation.title}
								//imageUrl={conversation.conversationImageUrl}
								users={conversation.users}
								key={conversation._id}
								type={conversation.conversationType}
								conversationName={conversation.title}
								conversationId={conversation._id}
								latestMessageTimestamp={conversation.latestMessageTimestamp}
								groupId={conversation.groupId}
								userData={conversation.userData}
							/>
						);
					})}
			</div>
		</ListContainer>
	);
}

export default ConversationList;
