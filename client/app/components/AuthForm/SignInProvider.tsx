import Image from "next/image";
import Link from "next/link";

import { SignInProviderProps } from "@/app/types/AuthForm";

function SignInProvider({
	apiURL,
	colorsClassName,
	iconURL,
	imageClassName,
	providerName,
}: SignInProviderProps) {
	return (
		<Link
			href={apiURL}
			type="button"
			className={`flex w-full items-center justify-center rounded-lg px-4 py-2 text-center text-base font-semibold transition duration-200 ease-in ${colorsClassName}`}
		>
			<Image
				src={iconURL}
				width={20}
				height={20}
				alt={`Authenticate with ${providerName}`}
				className={imageClassName}
			/>
			{`Sign in with ${providerName}`}
		</Link>
	);
}

export default SignInProvider;
