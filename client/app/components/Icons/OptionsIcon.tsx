function OptionsIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 32 32"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<g data-name="Layer 60" id="Layer_60">
				<circle cx="16" cy="16" r="1" />
				<path d="M16,18a2,2,0,1,1,2-2A2,2,0,0,1,16,18Zm0-2Z" />
				<circle cx="16" cy="5" r="1" />
				<path d="M16,7a2,2,0,1,1,2-2A2,2,0,0,1,16,7Zm0-2Z" />
				<circle cx="16" cy="27" r="1" />
				<path d="M16,29a2,2,0,1,1,2-2A2,2,0,0,1,16,29Zm0-2Z" />
			</g>
		</svg>
	);
}

export default OptionsIcon;
