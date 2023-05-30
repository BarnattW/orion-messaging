import Link from "next/link";
import Image from "next/image";

interface props {
	type: string;
}

function AuthForm(props: props) {
	const isLogin = props.type === "login" ? true : false;

	return (
		<div className="bg-gradient-to-r from-zinc-800 to-neutral-800 h-full min-h-full">
			<div className="items-center flex h-full">
				<div className="items-center justify-center flex flex-col grow drop-shadow-lg rounded md:m-auto md:mt-1/2 md:max-w-lg h-full md:h-2/3 bg-zinc-800">
					<div className="mb-6">
						<Image
							src="/orion-logo2.svg"
							width={150}
							height={150}
							alt="Orion Messaging Logo"
						/>
					</div>
					<div className="flex flex-col gap-3 mb-12 w-2/3">
						<button
							type="button"
							className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 w-full transition ease-in duration-200 text-center text-base font-semibold rounded-lg"
						>
							<Image
								src="/fb-icon.svg"
								width={20}
								height={20}
								alt="Authenticate with Facebook"
								className="ml-4 mr-2"
							/>
							{isLogin ? "Sign in with Facebook? " : "Sign Up with Facebook "}
						</button>

						<button
							type="button"
							className="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 w-full transition ease-in duration-200 text-center text-base font-semibold rounded-lg "
						>
							<Image
								src="/google-icon.svg"
								width={20}
								height={20}
								alt="Authenticate with Google"
								className="mr-2"
							/>
							{isLogin ? "Sign in with Google " : "Sign Up with Google "}
						</button>

						<button
							type="button"
							className="py-2 px-4 flex justify-center items-center  bg-gray-600 hover:bg-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold rounded-lg "
						>
							<Image
								src="/github-icon.svg"
								width={20}
								height={20}
								alt="Authenticate with Github"
								className="mr-2"
							/>
							{isLogin ? "Sign in with Github " : "Sign Up with Github "}
						</button>
					</div>
					<div className="mb-6">
						<p>
							{isLogin
								? "Don't have an account? "
								: "Already have an account? "}
							<Link
								className="font-bold underline"
								href={isLogin ? "/auth/signup" : "/auth/login"}
							>
								{isLogin ? "Create an account" : "Sign back in"}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AuthForm;
