function EmojiIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			className={className}
		>
			<path fill="none" d="M0 0h256v256H0z" />
			<circle
				cx="128"
				cy="128"
				r="96"
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={16}
			/>
			<circle cx="92" cy="108" r="12" />
			<circle cx="164" cy="108" r="12" />
			<path
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={16}
				d="M169.6 152a48.1 48.1 0 0 1-83.2 0"
			/>
		</svg>
	);
}

export default EmojiIcon;
