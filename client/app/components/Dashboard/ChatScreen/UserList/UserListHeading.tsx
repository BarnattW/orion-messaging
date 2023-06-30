interface ContainerProps {
	children: React.ReactNode;
}

function UserListHeading({ children }: ContainerProps) {
	return <div className="mt-2 px-5 pt-2 text-lg">{children}</div>;
}

export default UserListHeading;
