function HamburgerMenuIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			className={className}
		>
			<path
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth="2"
				d="M7 16h18M7 25h18M7 7h18"
			/>
		</svg>
	);
}

export default HamburgerMenuIcon;
