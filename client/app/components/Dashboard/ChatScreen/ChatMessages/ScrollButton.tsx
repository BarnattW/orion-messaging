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
					? "absolute bottom-16 right-1 z-20 animate-bounce rounded-full bg-gray-100 p-2 text-sm hover:bg-gray-300"
					: "hidden"
			}
		>
			<DownArrowIcon />
		</button>
	);
}

export default ScrollButton;
