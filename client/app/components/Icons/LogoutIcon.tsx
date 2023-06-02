import React from "react";

interface LogoutIconProps {
	className?: string;
	color?: string;
}

function LogoutIcon({ className, color }: LogoutIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			className={className}
		>
			<style>{`.cls-1{fill:none;stroke:${color};stroke-linecap:round;stroke-linejoin:round;stroke-width:2px};`}</style>
			<path d="M15.92 16h13" className="cls-1" />
			<path d="M23.93 25v3h-16V4h16v3h2V3a1 1 0 0 0-1-1h-18a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4Z" />
			<path
				d="m28.92 16-4 4M28.92 16l-4-4M24.92 8.09v-2M24.92 26v-2"
				className="cls-1"
			/>
		</svg>
	);
}

export default LogoutIcon;
