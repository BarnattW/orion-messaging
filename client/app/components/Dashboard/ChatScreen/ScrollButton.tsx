import { useState } from "react";
import LogoutIcon from "../../Icons/LogoutIcon";

function ScrollButton() {
	const [showScrollButton, setShowScrollButton] = useState(false);

	return (
		<button className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-20 left-full ml-2 -my-7">
			<LogoutIcon color="#737373" />
		</button>
	);
}

export default ScrollButton;
