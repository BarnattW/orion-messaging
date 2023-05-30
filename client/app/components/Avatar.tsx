import Image from "next/image";

interface avatarProps {
	imageUrl: string;
	altText: string;
	size?: number;
	onlineStatus: string;
}

function Avatar({ imageUrl, altText, size = 300, onlineStatus }: avatarProps) {
	return (
		<div className="relative z-0">
			<div className="rounded-full ring-2 ring-white h-8 w-8">
				<Image
					src={imageUrl}
					width={size}
					height={size}
					alt={altText}
					className="rounded-full"
				/>
			</div>
			<span
				className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ${
					onlineStatus === "online" ? "bg-green-500" : "bg-gray-500"
				}`}
			></span>
		</div>
	);
}

export default Avatar;
