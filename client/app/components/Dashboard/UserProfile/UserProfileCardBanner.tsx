import Image from "next/image";

function UserProfileCardBanner() {
	return (
		<div className="w-full max-h-36 overflow-hidden">
			<Image
				src="/starry.avif"
				width={300}
				height={100}
				alt="starry"
				style={{ objectFit: "scale-down" }}
				className="select-none"
			/>
			<div
				className="absolute top-0 right-0 transform -translate-x-2 translate-y-2 select-none hover:cursor-pointer"
				onClick={closeProfile}
			>
				<ExitIcon />
			</div>
		</div>
	);
}
