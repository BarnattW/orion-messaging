interface ContainerProps {
	children: React.ReactNode;
}

function UserListContainer({ children }: ContainerProps) {
	return (
		<div className="overflow-visble flex h-full w-full select-none flex-col gap-4 border-l-2 border-neutral-700 text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:w-72 sm:flex-shrink-0">
			{children}
		</div>
	);
}

export default UserListContainer;
