import { useState } from "react";

function Tooltip({
	content,
	children,
}: {
	content: string;
	children: React.ReactNode;
}) {
	const [showTooltip, setShowTooltip] = useState(false);

	const handleMouseEnter = () => {
		setShowTooltip(true);
	};

	const handleMouseLeave = () => {
		setShowTooltip(false);
	};

	return (
		<div
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			{showTooltip && (
				<span className="absolute left-full z-30 -mt-6 ml-1 whitespace-nowrap rounded bg-indigo-700 px-2 py-1 text-sm text-white">
					{content}
				</span>
			)}
		</div>
	);
}

export default Tooltip;
