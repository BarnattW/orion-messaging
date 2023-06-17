interface ContainerProps {
	children: React.ReactNode;
}

function NotificationHeading({ children }: ContainerProps) {
	return (
		<div className="text-sm px-5 sticky top-0 pt-2 pb-1 backdrop-blur-lg z-10 select-none">
			{children}
		</div>
	);
}

export default NotificationHeading;
