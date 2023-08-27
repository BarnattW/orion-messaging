import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<div className="sticky z-10 top-0 bg-zinc-900 w-full py-4 px-8 flex flex-row items-center justify-between border-b-2 border-zinc-600">
			<div className="flex flex-row items-center">
				<Image
					src="/orion-logo2.svg"
					width={60}
					height={60}
					alt="Orion Messaging Logo"
				/>
				<span className="text-xl font-medium">Orion Messaging</span>
			</div>
			<span>
				<Link
					href="/auth/login"
					className="bg-indigo-600 rounded-xl py-1.5 px-4"
				>
					Login
				</Link>
			</span>
		</div>
	);
}
