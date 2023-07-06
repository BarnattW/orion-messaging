interface ContainerProps {
	children: React.ReactNode;
}

function SettingsContainer({ children }: ContainerProps) {
	return (
		<div className="overflow-visble z-20 hidden h-full select-none gap-2 border-r-2 border-neutral-700 text-neutral-200 scrollbar-thin scrollbar-thumb-neutral-900 sm:flex sm:w-56 sm:flex-shrink-0 sm:flex-col lg:ml-24 xl:ml-52">
			{children}
		</div>
	);
}

export default SettingsContainer;
