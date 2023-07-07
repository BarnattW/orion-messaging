function AddIcon({ className }: { className?: string }) {
	return (
		<svg height="512" viewBox="0 0 512 512" width="512" className={className}>
			<line
				style={{
					fill: "none",
					strokeLinecap: "square",
					strokeLinejoin: "round",
					strokeWidth: "32px",
				}}
				x1="256"
				x2="256"
				y1="112"
				y2="400"
			/>
			<line
				style={{
					fill: "none",
					strokeLinecap: "square",
					strokeLinejoin: "round",
					strokeWidth: "32px",
				}}
				x1="400"
				x2="112"
				y1="256"
				y2="256"
			/>
		</svg>
	);
}

export default AddIcon;
