import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { UserProvider } from "./Context/UserContext";
import { UserData } from "./Context/UserData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Orion Messaging",
	description: "Orion Messaging",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<UserProvider>
					<UserData>{children}</UserData>
				</UserProvider>
			</body>
		</html>
	);
}
