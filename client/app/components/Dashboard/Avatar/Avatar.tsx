import Image from "next/image";

interface avatarProps {
	imageUrl: string;
	altText: string;
	size?: number;
}

function Avatar({ imageUrl, altText, size = 300 }: avatarProps) {
	return (
		<>
			<div className="rounded-full ring-2 ring-white h-8 w-8 flex-shrink-0">
				<Image
					src={imageUrl}
					width={size}
					height={size}
					alt={altText}
					className="rounded-full"
				/>
			</div>
		</>
	);
}

export default Avatar;
