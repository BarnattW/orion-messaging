interface ContainerProps {
	children: React.ReactNode;
}

function ListContainer({ children }: ContainerProps) {
	return (
		<div className="h-full w-full sm:w-72 flex flex-col gap-6 border-r-2 border-neutral-700 overflow-auto text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:flex-shrink-0 select-none">
			{children}
		</div>
	);
}

export default ListContainer;
