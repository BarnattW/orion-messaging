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
				<div className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-20 left-full ml-2 -my-7">
					{content}
				</div>
			)}
		</div>
	);
}

export default Tooltip;
