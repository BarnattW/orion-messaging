function HamburgerMenuIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			version="1.1"
			viewBox="0 0 32 32"
			className={className}
		>
			<line
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth="2"
				x1="7"
				x2="25"
				y1="16"
				y2="16"
			/>
			<line
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth="2"
				x1="7"
				x2="25"
				y1="25"
				y2="25"
			/>
			<line
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth="2"
				x1="7"
				x2="25"
				y1="7"
				y2="7"
			/>
		</svg>
	);
}

export default HamburgerMenuIcon;
