interface props {
	onlineStatus: string;
}

function OnlineStatus(onlineStatus: props) {
	return (
		<>
			<span
				className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ${
					onlineStatus.onlineStatus === "online"
						? "bg-green-500"
						: "bg-gray-500"
				}`}
			></span>
		</>
	);
}

export default OnlineStatus;
