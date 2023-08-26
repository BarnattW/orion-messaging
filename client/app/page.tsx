import Link from "next/link";

import Header from "./components/Header/Header";

export default function Home() {
	return (
		<main className="bg-zinc-800 h-full overflow-y-scroll">
			<Header />
			<div className="w-2/3 flex flex-col m-auto">
				<div className="text-2xl px-12 pt-12 pb-8 flex flex-col gap-4">
					<div className="font-bold text-3xl">
						{" "}
						Orion Messaging - A Messaging Application
					</div>
					<div>Chat, Connect, Make Memories.</div>
				</div>
				<div className="flex flex-col px-12 py-8 leading-loose gap-4 text-lg w-96">
					<div className="font-semibold text-3xl">Communication Made Easy</div>
					<div>
						Send messages to friends from across the world with direct messages
						or group chats
					</div>
				</div>
				<div className="flex flex-col px-12 py-8 leading-loose gap-4 text-lg w-96 ml-auto">
					<div className="font-semibold text-3xl">Include Everyone!</div>
					<div>
						Add friends with their usernames, then create group chats with other
						friends
					</div>
				</div>
				<div className="text-xl px-12 py-8 flex flex-col gap-4">
					<div className="font-bold text-2xl"> Note From the Developers</div>
					<div>
						This project was done during the span of summer 2023, meant to be a
						challenge and learning experience in designing and implementing a
						distributed microservices system. The hardest part of the process in
						implementing our architecture was communication between our
						services, and our inexperience with common solutions forced us to
						leave some design flaws although we did have some solutions in mind.
					</div>
					<div>
						Ultimately, we ran out of time to add some additional features, such
						as multimedia sharing and storage with a cloud bucket store and
						audio calls. Despite the shortcomings, overall the project was a
						success and it would not have been possible without everyone
						involved.
					</div>
					<div className="font-bold">Developers</div>
					<div>
						<Link
							href="https://www.linkedin.com/in/barnattwu/"
							target="_blank"
							className="hover:text-indigo-700 text-indigo-500"
						>
							Barnatt Wu
						</Link>{" "}
						- Project Lead & Front-End Developer | Second-Year Computer Science
						At Stevens Institute of Technology
					</div>
					<div>
						<Link
							href=""
							target="_blank"
							className="hover:text-indigo-700 text-indigo-500"
						>
							Geoffrey Lin
						</Link>{" "}
						- Back-End Developer | Second-Year Computer Science At Rochester
						Institute of Technology
					</div>
					<div>
						<Link
							href="https://www.linkedin.com/in/raymond-yeung-3384aa222/"
							target="_blank"
							className="hover:text-indigo-700 text-indigo-500"
						>
							Raymond Yeung
						</Link>{" "}
						- Back-End Developer | Second-Year Computer Science At Georgia
						Institute of Technology
					</div>
				</div>
			</div>
		</main>
	);
}
