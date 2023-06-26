import Image from "next/image";

import SignInProvider from "./SignInProvider";

function AuthForm() {
	return (
		<div className="h-full min-h-full bg-gradient-to-r from-zinc-800 to-neutral-800">
			<div className="flex h-full items-center">
				<div className="md:mt-1/2 flex h-full grow flex-col items-center justify-center rounded bg-zinc-800 drop-shadow-lg md:m-auto md:h-2/3 md:max-w-lg">
					<div className="mb-6">
						<Image
							src="/orion-logo2.svg"
							width={150}
							height={150}
							alt="Orion Messaging Logo"
						/>
					</div>
					<div className="mb-12 flex w-2/3 flex-col gap-3">
						<SignInProvider
							apiURL="/api/auth/facebook"
							colorsClassName="bg-blue-600 hover:bg-blue-700"
							iconURL="/fb-icon.svg"
							imageClassName="ml-4 mr-2"
							providerName="Facebook"
						/>
						<SignInProvider
							apiURL="/api/auth/google"
							colorsClassName="bg-red-600 hover:bg-red-700"
							iconURL="/google-icon.svg"
							imageClassName="mr-2"
							providerName="Google"
						/>
						<SignInProvider
							apiURL="/api/auth/github"
							colorsClassName="bg-gray-600 hover:bg-gray-700"
							iconURL="/github-icon.svg"
							imageClassName="mr-2"
							providerName="Github"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AuthForm;
