interface ContainerProps {
	children: React.ReactNode;
}

function NotificationHeading({ children }: ContainerProps) {
	return (
		<div className="text-sm px-5 sticky top-0 py-2 bg-zinc-700 z-10 select-none">
			{children}
		</div>
	);
}

export default NotificationHeading;
