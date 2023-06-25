import { useCallback, useEffect, useRef, useState } from "react";

export default function useComponentVisible(initialIsVisible: boolean) {
	const [isComponentVisible, setIsComponentVisible] =
		useState(initialIsVisible);
	const ref = useRef(null);
	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			// @ts-ignore
			if (ref.current && ref.current.contains(event.target as Node)) return;
			if (isComponentVisible) {
				setIsComponentVisible(false);
			}
		},
		[isComponentVisible]
	);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [handleClickOutside]);

	return { ref, isComponentVisible, setIsComponentVisible };
}
