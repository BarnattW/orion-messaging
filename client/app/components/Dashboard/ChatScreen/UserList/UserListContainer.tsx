interface ContainerProps {
	children: React.ReactNode;
}

function UserListContainer({ children }: ContainerProps) {
	return (
		<div className="overflow-visble hidden h-full w-full select-none gap-4 border-l-2 border-neutral-700 text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:flex sm:w-32 sm:flex-shrink-0 sm:flex-col md:w-48 lg:w-60">
			{children}
		</div>
	);
}

export default UserListContainer;
