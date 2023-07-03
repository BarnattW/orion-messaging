function HamburgerMenuIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			className={className}
		>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-miterlimit="10"
				stroke-width="2"
				d="M7 16h18M7 25h18M7 7h18"
			/>
		</svg>
	);
}

export default HamburgerMenuIcon;
