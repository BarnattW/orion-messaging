import Image from "next/image";
import { AvatarProps } from "@/app/types/UserProfile";

function Avatar({
	imageUrl,
	altText,
	size = 300,
	username,
	type,
}: AvatarProps) {
	let className: string =
		"rounded-full h-8 w-8 flex-shrink-0 hover:cursor-pointer overflow-hidden";
	if (type === "userProfile") {
		className = "rounded-full h-16 w-16 flex-shrink-0 hover:cursor-pointer";
	}
	if (type === "message") {
		className = "rounded-full h-10 w-10 flex-shrink-0 hover:cursor-pointer";
	}

	return (
		<>
			<div className={className}>
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
