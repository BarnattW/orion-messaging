function DeleteIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 256 256"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<rect fill="none" height="256" width="256"></rect>
			<line
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
				x1="216"
				x2="40"
				y1="56"
				y2="56"
			></line>
			<line
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
				x1="104"
				x2="104"
				y1="104"
				y2="168"
			></line>
			<line
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
				x1="152"
				x2="152"
				y1="104"
				y2="168"
			></line>
			<path
				d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			></path>
			<path
				d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			></path>
		</svg>
	);
}

export default DeleteIcon;
