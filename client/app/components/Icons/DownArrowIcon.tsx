function DownArrowIcon({ className }: { className?: string }) {
	return (
		<svg
			height="20"
			viewBox="0 0 512 512"
			width="20"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<polyline
				points="112 268 256 412 400 268"
				style={{
					fill: "none",
					stroke: "#000",
					strokeLinecap: "square",
					strokeMiterlimit: 10,
					strokeWidth: "48px",
				}}
			/>
			<line
				style={{
					fill: "none",
					stroke: "#000",
					strokeLinecap: "square",
					strokeMiterlimit: 10,
					strokeWidth: "48px",
				}}
				x1="256"
				x2="256"
				y1="392"
				y2="100"
			/>
		</svg>
	);
}

export default DownArrowIcon;
