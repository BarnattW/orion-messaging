export interface TooltipProps {
	content: string;
	contextMenuPosition: { x: number; y: number };
}

function Tooltip({ content, contextMenuPosition }: TooltipProps) {
	return (
		<div
			style={{
				top: contextMenuPosition.y,
				left: contextMenuPosition.x,
			}}
			className="fixed z-30 inline-block overflow-auto rounded bg-indigo-700 px-2 py-1 text-sm text-white"
		>
			<span className="">{content}</span>
		</div>
	);
}

export default Tooltip;
