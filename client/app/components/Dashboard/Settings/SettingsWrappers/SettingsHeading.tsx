interface ContainerProps {
	children: React.ReactNode;
}

function SettingsHeading({ children }: ContainerProps) {
	return <div className="bg-zinc-800 px-7 pb-1 pt-8 text-2xl">{children}</div>;
}

export default SettingsHeading;
