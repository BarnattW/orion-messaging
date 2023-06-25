import DownArrowIcon from "@/app/components/Icons/DownArrowIcon";

interface ScrollButtonProps {
	scrollToBottom: () => void;
	showScrollButton: boolean;
}

function ScrollButton({ scrollToBottom, showScrollButton }: ScrollButtonProps) {
	return (
		<button
			onClick={scrollToBottom}
			className={
				showScrollButton
					? "absolute bottom-20 right-6 z-20 rounded-full bg-gray-100 px-2 py-2 text-sm hover:bg-gray-300"
					: "hidden"
			}
		>
			<DownArrowIcon />
		</button>
	);
}

export default ScrollButton;
