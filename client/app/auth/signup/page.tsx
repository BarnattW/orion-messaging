import AuthForm from "@/app/components/AuthForm/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orion Messaging Signup",
	description: "Signup page for Orion Messaging",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
};
export default function SignupPage() {
	return (
		<>
			<AuthForm type="signup" />
		</>
	);
}
