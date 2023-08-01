import { IUser, User } from "../../models/User";

export async function createUser(data: any) {
  try {
    const { username, userId }: { username: string; userId: string } = data;
    console.log(username, userId)
    const user = {
      userId: userId,
      username: username,
    };

    const createdUser = await User.create(user);

    if (!createdUser) {
      return console.log("Failed to Create User");
    }

    console.log("Created User", createdUser);
  } catch (e) {
    console.log("Unable to create user: ", e);
  }
}
