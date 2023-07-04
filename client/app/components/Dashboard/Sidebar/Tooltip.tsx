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
				<div className="absolute left-full z-30 -my-7 ml-2 rounded bg-gray-800 px-2 py-1 text-sm text-white">
					{content}
				</div>
			)}
		</div>
	);
}

export default Tooltip;
