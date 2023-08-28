import { User } from "../models/user";

export async function toggleNotifications(userId: String, bool: boolean) {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ userId: userId },
			{ $set: { receiveNotification: bool } },
			{ new: true }
		);

		if (updatedUser) {
			console.log("Updated user:", updatedUser);
		} else {
			console.log("User not found");
		}
	} catch (error) {
		console.log("error updating user");
	}
}

export async function getPreference(userId: String) {
	try {
		const user = await User.findOne({ userId: userId });
		if (!user) {
			console.log("user not found");
			return "";
		}
		console.log(
			`${userId} has notifications set to ${user.receiveNotifications}`
		);
	} catch (error) {
		console.log("error getting preference");
	}
}
