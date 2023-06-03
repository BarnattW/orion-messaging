interface ContainerProps {
	children: React.ReactNode;
}

function ListHeading({ children }: ContainerProps) {
	return (
		<div className="text-lg px-5 bg-zinc-800 sticky top-0 pt-8 pb-1 backdrop-blur-lg z-10">
			{children}
		</div>
	);
}

export default ListHeading;
