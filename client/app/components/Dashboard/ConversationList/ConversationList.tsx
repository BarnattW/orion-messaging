"use client";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";

import useComponentVisible from "@/app/custom-hooks/useComponentVisible";
import { useUserStore } from "@/app/store/userStore";

import AddIcon from "../../Icons/AddIcon";
import ReceivedGroupRequests from "../FriendRequests/ReceivedGroupRequests";
import ListContainer from "../ListWrappers/ListContainer";
import ListHeading from "../ListWrappers/ListHeading";
import ConversationCard from "./ConversationCard";
import CreateGroupChat from "./CreateGroupChat";

const iconClassNames: string =
	"h-7 w-7 hover:cursor-pointer stroke-gray-100 hover:stroke-gray-400";

function ConversationList() {
	const { conversations, groupRequests, setGroupRequests, userId } =
		useUserStore(
			(state) => ({
				conversations: state.conversations,
				groupRequests: state.groupRequests,
				setGroupRequests: state.setGroupRequests,
				userId: state.userId,
			}),
			shallow
		);
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	console.log(conversations);

	const toggleCreateGroup = () => {
		setIsComponentVisible((prevBool) => !prevBool);
	};

	// fetch all incoming and outgoing group requests
	useEffect(() => {
		async function getRequests() {
			try {
				const responseGroup = await fetch(
					`/api/connect/${userId}/getGroupReqs`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!responseGroup.ok) {
					// update with common error handling
					console.log(responseGroup);
				}
				const groupRequests = await responseGroup.json();
				setGroupRequests({
					receivedRequests: groupRequests.incoming,
					sentRequests: groupRequests.outgoing,
				});
			} catch (error) {
				console.log(error);
			}
		}

		getRequests();
	}, [userId, setGroupRequests]);

	return (
		<ListContainer>
			{groupRequests.receivedRequests &&
				groupRequests.receivedRequests.length > 0 && (
					<ReceivedGroupRequests
						receivedRequests={groupRequests.receivedRequests}
					/>
				)}
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
