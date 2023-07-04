import NotificationCard from "./NotificationCard";
import NotificationHeading from "./NotificationHeading";

function NotificationWrapper({
	children,
	toggleNotifications,
}: {
	children: React.ReactNode;
	toggleNotifications: boolean;
}) {
	return (
		<div className="relative">
			{children}
			{toggleNotifications && (
				<div className="absolute left-full z-30 -my-7 ml-2 max-h-72 w-52 overflow-auto rounded bg-zinc-700 text-sm text-white scrollbar-thin scrollbar-thumb-neutral-800">
					<NotificationHeading>Notifications</NotificationHeading>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
					<NotificationCard
						altText="dummy"
						users={["a", "b"]}
						type="default"
						conversationName="a"
					/>
				</div>
			)}
		</div>
	);
}

export default NotificationWrapper;
