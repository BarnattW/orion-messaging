function FileClipIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 256 256"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<rect fill="none" height="256" width="256" />
			<path
				d="M160,80,76.7,164.7a16,16,0,0,0,22.6,22.6L198.6,86.6a32,32,0,0,0-45.2-45.2L54.1,142.1a47.9,47.9,0,0,0,67.8,67.8L204,128"
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={12}
			/>
		</svg>
	);
}

export default FileClipIcon;
