interface ContainerProps {
	children: React.ReactNode;
}

function ListContainer({ children }: ContainerProps) {
	return (
		<div className="overflow-visble flex h-full w-full select-none flex-col gap-6 border-r-2 border-neutral-700 text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:w-72 sm:flex-shrink-0">
			{children}
		</div>
	);
}

export default ListContainer;
