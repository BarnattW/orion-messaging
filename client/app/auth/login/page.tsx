import AuthForm from "@/app/components/AuthForm/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orion Messaging Login",
	description: "Login page for Orion Messaging",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
};
export default function LoginPage() {
	return (
		<>
			<AuthForm />
		</>
	);
}
